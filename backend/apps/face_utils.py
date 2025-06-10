import os
from io import BytesIO
from typing import Dict

import face_recognition
import numpy as np


def load_face_database(db_path: str = "faces_db") -> Dict[str, np.ndarray]:
    """Load face database with embeddings"""
    embeddings = {}
    for filename in os.listdir(db_path):
        if filename.lower().endswith((".jpg", ".jpeg", ".png")):
            person_id = os.path.splitext(filename)[0]
            image_path = os.path.join(db_path, filename)
            
            # 1. Загрузка фоток
            image = face_recognition.load_image_file(image_path)
            
            # 2. Моделька для локации лица
            face_locations = face_recognition.face_locations(image)
            
            if not face_locations:
                print(f"⚠️ No face found in {filename}. Skipping.")
                continue
                
            # Только одно лицо на фото
            if len(face_locations) > 1:
                print(f"⚠️ Multiple faces in {filename}. Using first detected face.")
            
            # 3. Берем embedding vector
            face_encodings = face_recognition.face_encodings(
                image, 
                known_face_locations=[face_locations[0]]
            )
            
            if face_encodings:
                # 4. Store embedding in memory
                embeddings[person_id] = face_encodings[0]
                print(f"✅ Loaded {person_id} (Embedding shape: {face_encodings[0].shape})")
    
    print(f"📊 Loaded {len(embeddings)} face embeddings")
    return embeddings

def recognize_face(image_data: bytes, face_db: Dict[str, np.ndarray]) -> dict:
    """Recognize face using embeddings"""
    MATCH_THRESHOLD = 0.6  # трещхолд
    # 1. Загрузим фото
    image = face_recognition.load_image_file(BytesIO(image_data))
    
    # 2. Детектим лицо
    face_locations = face_recognition.face_locations(image)
    if not face_locations:
        return {
            "matched": False,
            "person_id": None,
            "distance": 1.0,
            "threshold": MATCH_THRESHOLD,
            "face_location": None,
        }
    
    # 3. Берем embeddings для первого лица только
    query_embeddings = face_recognition.face_encodings(
        image, 
        known_face_locations=[face_locations[0]]
    )
    
    if not query_embeddings:
        return {
            "matched": False,
            "person_id": None,
            "distance": 1.0,
            "threshold": MATCH_THRESHOLD,
            "face_location": None,
        }
    
    query_embedding = query_embeddings[0]
    
    # 4. Сравниваем с базой векторов
    min_distance = float("inf")
    best_match = None
    
    for person_id, db_embedding in face_db.items():
        #  Euclidean distance между векторами
        distance = np.linalg.norm(query_embedding - db_embedding)
        
        if distance < min_distance:
            min_distance = distance
            best_match = person_id
    
    
    matched = min_distance <= MATCH_THRESHOLD
    return {
        "matched": bool(matched),
        "person_id": best_match if matched else None,
        "distance": float(min_distance),
        "threshold": MATCH_THRESHOLD,
        "face_location": list(face_locations[0])  # [top, right, bottom, left]
    }