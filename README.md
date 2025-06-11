# ECC Biometrics

A project focused on biometric authentication for ECC

Проект, посвящённый биометрической аутентификации для ЦЕФ

## Features / Возможности

- Secure biometric data processing  
   Безопасная обработка биометрических данных
- Easy integration  
   Простая интеграция

## Installation / Установка

```bash
git clone REPO
cd ecc_biometrics
docker-compose -f docker-compose-dev.yml up --build
```

## Separate Run / Отдельный запуск

backend

```bash
cd ecc_biometrics/backend
python3 -m venv venv
activate ./venv/bin/activate
# brew install cmake // optional(on mac could be errors due to dlib)
pip install -r requirements.txt
uvicorn apps.main:app --reload --port 8000
```

frontend

```bash
cd ecc_biometrics/frontend
npm install
npm run dev
```
