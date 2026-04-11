import os
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from dotenv import load_dotenv

load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID", "VA230e0ccf8f235b3335210656de93e597")

async def send_verify_otp(to_phone: str) -> bool:
    """Dispatches a native Twilio Verify SMS code"""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print(f"DEBUG SMS VERIFY (Twilio Config Missing) for {to_phone}")
        return False
        
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        verification = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create(
            to=to_phone, 
            channel='sms'
        )
        return verification.status == 'pending'
    except TwilioRestException as e:
        print(f"Twilio Verify SMS Error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected Verify SMS Error: {e}")
        return False

async def check_verify_otp(to_phone: str, code: str) -> bool:
    """Checks the verification code against Twilio's cached state"""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print(f"DEBUG SMS CHECK (Config Missing! Assuming Failed validation.)")
        return False
        
    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        verification_check = client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verification_checks.create(
            to=to_phone,
            code=code
        )
        return verification_check.status == 'approved'
    except TwilioRestException as e:
        print(f"Twilio Verify Check Error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected Verify Check Error: {e}")
        return False
