
# 🚀 CV Optimizer Pro - Deployment na Render

## 📋 Wymagania przed deploymentem

### 1. 🔑 Przygotuj klucze API

Upewnij się, że masz:
- **OpenRouter API Key**: https://openrouter.ai/
- **Stripe API Keys**: https://dashboard.stripe.com/test/apikeys
- **PostgreSQL Database**: Stwórz bazę na Render lub użyj zewnętrznej

### 2. 📁 Struktura projektu

```
cv-optimizer-pro/
├── app.py                 # Główna aplikacja Flask
├── requirements.txt       # Dependencies Pythona
├── runtime.txt           # Wersja Pythona
├── Procfile              # Komendy uruchomieniowe
├── render.yaml           # Konfiguracja Render
├── gunicorn.conf.py      # Konfiguracja serwera
└── utils/                # Moduły pomocnicze
```

## 🚀 Kroki deploymentu na Render

### Krok 1: Przygotuj repozytorium
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Krok 2: Stwórz aplikację na Render
1. Idź na https://render.com
2. Kliknij "New" → "Web Service"
3. Połącz z Twoim repozytorium GitHub

### Krok 3: Konfiguracja na Render
- **Name**: `cv-optimizer-pro`
- **Environment**: `Python 3`
- **Build Command**: Auto-detect (używa render.yaml)
- **Start Command**: Auto-detect (używa Procfile)

### Krok 4: Dodaj zmienne środowiskowe

W sekcji "Environment Variables" dodaj:

```
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
VITE_STRIPE_PUBLIC_KEY=pk_test_your-stripe-public-key
SECRET_KEY=your-super-secret-key-production
SESSION_SECRET=your-session-secret-key
ENCRYPTION_KEY=your-base64-encryption-key
DATABASE_URL=postgresql://user:pass@host:port/database
FLASK_ENV=production
DEBUG=false
PORT=10000
```

### Krok 5: Deploy!
- Kliknij "Create Web Service"
- Render automatycznie zbuiluje i uruchomi aplikację

## 🔗 Po deploymencie

Twoja aplikacja będzie dostępna pod adresem:
`https://cv-optimizer-pro.onrender.com`

## 🐛 Troubleshooting

### Problem z bibliotekami
Jeśli wystąpią błędy z bibliotekami, sprawdź logi i zmodyfikuj `requirements.txt`

### Problem z bazą danych
Sprawdź czy `DATABASE_URL` jest poprawnie ustawiony

### Problem z kluczami API
Sprawdź czy wszystkie klucze są ustawione w Environment Variables

## 📞 Wsparcie

W razie problemów sprawdź:
1. Logi w panelu Render
2. Zmienne środowiskowe
3. Status bazy danych
