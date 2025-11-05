from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from data.database import USERS
from utils.security import hash_password, verify_password
from utils.jwt_handler import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterPayload(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginPayload(BaseModel):
    email: EmailStr
    password: str

@router.post("/register")
def register(payload: RegisterPayload):
    # simple uniqueness by email
    if any(u["email"].lower() == payload.email.lower() for u in USERS):
        raise HTTPException(status_code=400, detail="Email already registered")
    next_id = max([u["id"] for u in USERS] or [0]) + 1
    USERS.append({
        "id": next_id,
        "name": payload.name,
        "email": payload.email,
        "password": hash_password(payload.password),
    })
    return {"id": next_id, "name": payload.name, "email": payload.email}

@router.post("/login")
def login(payload: LoginPayload):
    user = next((u for u in USERS if u["email"].lower() == payload.email.lower()), None)
    if not user or not verify_password(payload.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(sub=str(user["id"]))
    return {"access_token": token, "token_type": "bearer"}
