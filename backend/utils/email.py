import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 465))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

async def send_otp_email(to_email: str, otp_code: str):
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print(f"DEBUG EMAIL (SMTP Config Missing) OTP for {to_email}: {otp_code}")
        return False
        
    msg = EmailMessage()
    msg.set_content(f"Welcome to MindfulAI.\n\nYour secure authentication passcode is: {otp_code}\n\nThis code will expire in 5 minutes.")
    msg["Subject"] = "Your MindfulAI Login Passcode"
    msg["From"] = SMTP_USERNAME
    msg["To"] = to_email

    try:
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.send_message(msg)
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False
