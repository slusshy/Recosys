from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()


class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


@router.post("/contact")
async def contact(payload: ContactPayload):
    print("[CONTACT]", payload.dict())
    return {
        "status": "success",
        "message": f"Thank you {payload.name}, your message has been received!",
    }
