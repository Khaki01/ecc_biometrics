import numpy as np
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer

from apps.face_utils import load_face_database, recognize_face
from apps.security import create_face_token, verify_token

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Загрузка данных
FACE_DB = load_face_database()

@app.post("/auth")
async def authenticate_user(file: UploadFile = File(...)):
    """Authenticate user via face and return JWT"""
    contents = await file.read()
    result = recognize_face(contents, FACE_DB)
    
    if not result["matched"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Face not recognized"
        )
    # токен просто на основе имя файла
    token = create_face_token(result["person_id"])
    return {"access_token": token, "token_type": "bearer"}

@app.post("/identify")
async def identity_face(
    file: UploadFile = File(...),
    credentials: HTTPBearer = Depends(security)
):
    """Защищенный запрос для теста идентификации"""
    payload = verify_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    
    contents = await file.read()
    result = recognize_face(contents, FACE_DB)
    return result
