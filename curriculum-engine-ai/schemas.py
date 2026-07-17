from pydantic import BaseModel, EmailStr


class BetaSignupRequest(BaseModel):
    email: EmailStr
