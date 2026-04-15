from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorCollection
from database import get_db
from models import UserCreate, UserLogin, Token, OTPRequest, OTPVerify, UserUpdate, DBUser, DBOTP
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from core.security import get_password_hash, verify_password, create_access_token, get_current_user
from utils.sms import send_verify_otp, check_verify_otp
from utils.email import send_otp_email
import uuid
import secrets
import datetime
from datetime import timezone

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=Token)
async def signup(user: UserCreate, db_sql: AsyncSession = Depends(get_db)):
    # 1. Check SQL Identity Store
    query = select(DBUser).where((DBUser.email == user.email) | (DBUser.username == user.username))
    result = await db_sql.execute(query)
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
        
    user_id = str(uuid.uuid4())
    
    # 2. Store in SQL (Standard Identity)
    new_user = DBUser(
        user_id=user_id,
        username=user.username,
        email=user.email,
        password_hash=get_password_hash(user.password),
        full_name=user.full_name,
        phone=user.phone
    )
    db_sql.add(new_user)
    
    # Commit SQL transaction
    await db_sql.commit()
    
    access_token = create_access_token(data={"sub": user_id})
    return {
        "access_token": access_token, 
        "token": access_token,
        "token_type": "bearer", 
        "user_id": user_id,
        "user": {
            "user_id": user_id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name
        }
    }

@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin, db_sql: AsyncSession = Depends(get_db)):
    query = select(DBUser).where((DBUser.email == user_credentials.email) | (DBUser.username == user_credentials.email))
    result = await db_sql.execute(query)
    db_user = result.scalars().first()
    
    if not db_user or not verify_password(user_credentials.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": db_user.user_id})
    return {"token": access_token, "access_token": access_token, "token_type": "bearer", "user_id": db_user.user_id, "user": {"user_id": db_user.user_id, "username": db_user.username, "email": db_user.email}}

@router.post("/request-otp")
async def request_otp(data: OTPRequest, db_sql: AsyncSession = Depends(get_db)):
    identifier = data.email if data.email else data.phone
    if not identifier:
        raise HTTPException(status_code=400, detail="Email or phone must be provided")

    # Ensure user exists logic (Hybrid Identity Sync)
    # 1. Check SQL first (Primary Identity)
    query_sql = select(DBUser).where((DBUser.email == identifier) | (DBUser.phone == identifier))
    res_sql = await db_sql.execute(query_sql)
    user_sql = res_sql.scalars().first()
    
    if not user_sql:
        # Create Shell Identity in SQL
        user_id = str(uuid.uuid4())
        user_sql = DBUser(
            user_id=user_id,
            username=f"User_{user_id[:8]}",
            email=data.email if data.email else f"anon_{user_id[:8]}@example.com",
            phone=data.phone if data.phone else None,
            password_hash=get_password_hash(secrets.token_urlsafe(16)) # Random password for OTP users
        )
        db_sql.add(user_sql)
        await db_sql.commit()
        
    # -------------------------------------------------------------

    # -------------------------------------------------------------
    # PHONE LOGIC (Offloaded to Twilio Verify API)
    # -------------------------------------------------------------
    if data.phone:
        success = await send_verify_otp(data.phone)
        if not success:
            # If Twilio fails, fall back to local securely cached OTP
            otp_code = f"{secrets.randbelow(1_000_000):06d}"
            
            # Save OTP to SQL DB
            query_del = select(DBOTP).where(DBOTP.identifier == identifier)
            res_del = await db_sql.execute(query_del)
            old_otp = res_del.scalars().first()
            if old_otp:
                db_sql.delete(old_otp)
            
            new_otp = DBOTP(identifier=identifier, otp=otp_code)
            db_sql.add(new_otp)
            await db_sql.commit()
            print(f"DEBUG FALLBACK OTP for {identifier}: {otp_code}")
            return {"message": "OTP created successfully (Local SMS Fallback)", "debug_otp": otp_code}

        return {"message": "Verification requested via SMS"}

    # -------------------------------------------------------------
    # EMAIL LOGIC (Secured via local MongoDB Cache)
    # -------------------------------------------------------------
    if data.email:
        otp_code = f"{secrets.randbelow(1_000_000):06d}"
        
        # Save OTP to SQL DB
        query_del = select(DBOTP).where(DBOTP.identifier == identifier)
        res_del = await db_sql.execute(query_del)
        old_otp = res_del.scalars().first()
        if old_otp:
            await db_sql.delete(old_otp)
        
        new_otp = DBOTP(identifier=identifier, otp=otp_code)
        db_sql.add(new_otp)
        await db_sql.commit()
        
        email_sent = await send_otp_email(data.email, otp_code)
        if not email_sent:
            print(f"DEBUG FALLBACK OTP for {identifier}: {otp_code}")
        
        return {"message": "OTP created successfully", "debug_otp": otp_code}


@router.post("/verify-otp")
async def verify_otp(data: OTPVerify, db_sql: AsyncSession = Depends(get_db)):
    identifier = data.email if data.email else data.phone
    if not identifier or not data.otp:
        raise HTTPException(status_code=400, detail="Identifier and OTP required")

    # -------------------------------------------------------------
    # PHONE LOGIC (Offloaded to Twilio Verify API)
    # -------------------------------------------------------------
    if data.phone:
        is_approved = await check_verify_otp(data.phone, data.otp)
        if not is_approved:
            # Fallback to local OTP database if Twilio didn't work/wasn't used
            query_otp = select(DBOTP).where(DBOTP.identifier == identifier)
            res_otp = await db_sql.execute(query_otp)
            record = res_otp.scalars().first()
            if record:
                expiration_time = record.created_at.replace(tzinfo=timezone.utc) + datetime.timedelta(minutes=5)
                if datetime.datetime.now(timezone.utc) > expiration_time:
                    await db_sql.delete(record)
                    await db_sql.commit()
                    raise HTTPException(status_code=400, detail="Local SMS OTP has expired")
                if record.otp != data.otp:
                    raise HTTPException(status_code=400, detail="Incorrect Local SMS OTP")
                await db_sql.delete(record)
                await db_sql.commit()
            else:
                raise HTTPException(status_code=400, detail="Incorrect Twilio Verification Code or Local Code expired")

    # -------------------------------------------------------------
    # EMAIL LOGIC (Secured via local SQL Cache)
    # -------------------------------------------------------------
    if data.email:
        query_otp = select(DBOTP).where(DBOTP.identifier == identifier)
        res_otp = await db_sql.execute(query_otp)
        record = res_otp.scalars().first()
        if not record:
            raise HTTPException(status_code=400, detail="OTP expired or invalid")
            
        expiration_time = record.created_at.replace(tzinfo=timezone.utc) + datetime.timedelta(minutes=5)
        if datetime.datetime.now(timezone.utc) > expiration_time:
            await db_sql.delete(record)
            await db_sql.commit()
            raise HTTPException(status_code=400, detail="OTP has expired")
            
        if record.otp != data.otp:
            raise HTTPException(status_code=400, detail="Incorrect Email OTP")
            
        await db_sql.delete(record)
        await db_sql.commit()
    
    # -------------------------------------------------------------
    # SUCCESS JWT RESOLUTION
    # -------------------------------------------------------------
    query_user = select(DBUser).where((DBUser.email == identifier) | (DBUser.phone == identifier))
    res_user = await db_sql.execute(query_user)
    db_user = res_user.scalars().first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="User account error")
    
    access_token = create_access_token(data={"sub": db_user.user_id})
    return {"token": access_token, "access_token": access_token, "token_type": "bearer", "user_id": db_user.user_id, "user": {"user_id": db_user.user_id, "username": db_user.username, "email": db_user.email}}

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user), db_sql: AsyncSession = Depends(get_db)):
    query = select(DBUser).where(DBUser.user_id == user_id)
    result = await db_sql.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "created_at": user.created_at
    }

@router.put("/me")
async def update_me(update_data: UserUpdate, user_id: str = Depends(get_current_user), db_sql: AsyncSession = Depends(get_db)):
    update_fields = {k: v for k, v in update_data.model_dump().items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Update SQL
    q = update(DBUser).where(DBUser.user_id == user_id).values(**update_fields)
    await db_sql.execute(q)
    await db_sql.commit()
    
    
    # Get Updated
    query = select(DBUser).where(DBUser.user_id == user_id)
    result = await db_sql.execute(query)
    updated_user = result.scalars().first()
    
    return {"message": "Profile updated successfully", "user": {
        "user_id": updated_user.user_id,
        "username": updated_user.username,
        "email": updated_user.email,
        "full_name": updated_user.full_name,
        "phone": updated_user.phone
    }}
