from datetime import datetime, timedelta, timezone

from jose import jwt
from passlib.context import CryptContext

from apps.config import settings

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def create_face_token(person_id: str) -> str:
    """Создание JWT токена на основе face detection"""
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {
        "sub": person_id,
        "exp": expires,
        "auth_type": "biometric"
    }

    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_token(token: str) -> dict:
    """Верификация токена"""

    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.JWTError:
        return None