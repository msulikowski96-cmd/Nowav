
# 🚀 CV Optimizer Pro - Render Deployment Guide

## Prerequisites

1. **GitHub Repository** - Kod musi być w repozytorium GitHub
2. **Render Account** - Utwórz konto na https://render.com
3. **Neon Database** - PostgreSQL database (darmowy plan)

## Krok 1: Przygotowanie bazy danych

1. Utwórz konto na https://neon.tech
2. Stwórz nową bazę PostgreSQL
3. Skopiuj connection string (DATABASE_URL)

## Krok 2: Konfiguracja na Render

1. **Połącz GitHub** - Autoryzuj Render z GitHub
2. **Utwórz nowy Web Service**:
   - Repository: wybierz swoje repo
   - Branch: main
   - Runtime: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:create_app() --config gunicorn.conf.py`

## Krok 3: Environment Variables

W panelu Render dodaj następujące zmienne:

```
FLASK_ENV=production
DEBUG=false
PYTHONUNBUFFERED=1
WEB_CONCURRENCY=2

# Database
DATABASE_URL=postgresql://[your-neon-connection-string]

# Security
SECRET_KEY=[generate-random-secret-key]
SESSION_SECRET=[generate-random-session-secret]
ENCRYPTION_KEY=[generate-base64-encryption-key]

# APIs
OPENROUTER_API_KEY=[your-openrouter-key]
STRIPE_SECRET_KEY=[your-stripe-secret-key]
VITE_STRIPE_PUBLIC_KEY=[your-stripe-public-key]
```

## Krok 4: Deploy

1. Kliknij **Deploy**
2. Poczekaj na zakończenie procesu (5-10 minut)
3. Aplikacja będzie dostępna pod URL Render

## Weryfikacja

- Sprawdź logi w panelu Render
- Odwiedź endpoint `/test` aby sprawdzić status
- Zaloguj się kontem `developer` / `NewDev2024!`

## Rozwiązywanie problemów

### Błędy bazy danych
- Sprawdź poprawność DATABASE_URL
- Upewnij się, że Neon database jest aktywny

### Błędy importów
- Sprawdź czy wszystkie dependencje są w requirements.txt
- Sprawdź logi build w panelu Render

### Timeouty
- Zwiększ timeout w gunicorn.conf.py
- Zoptymalizuj zapytania do bazy danych

## Monitoring

- Render automatycznie monitoruje aplikację
- Logi są dostępne w czasie rzeczywistym
- Auto-restart w przypadku crashy
