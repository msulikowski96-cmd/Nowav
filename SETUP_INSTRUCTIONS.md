
# 🚀 CV Optimizer Pro - Kompleksowe Instrukcje Konfiguracji

## ⚡ Szybkie uruchomienie (3 kroki)

### 1. 🔑 Ustaw zmienne środowiskowe w Replit Secrets

Przejdź do panelu **Secrets** w Replit i dodaj następujące klucze:

#### Wymagane API Keys:

**OPENROUTER_API_KEY**
- Wartość: `sk-or-v1-twój-klucz-api-tutaj`
- Uzyskaj za darmo: https://openrouter.ai/
- Rejestracja jest darmowa, dostaniesz $1 kredytu na start

**STRIPE_SECRET_KEY**
- Wartość: `sk_test_twój-stripe-secret-key`
- Uzyskaj z: https://dashboard.stripe.com/test/apikeys

**VITE_STRIPE_PUBLIC_KEY**
- Wartość: `pk_test_twój-stripe-public-key`
- Ten sam panel Stripe co wyżej

**SECRET_KEY**
- Wartość: `cv-optimizer-super-secret-key-2024-production`
- Lub wygeneruj własny bezpieczny klucz

### 2. 🔧 Sprawdź konfigurację

```bash
python check_config.py
```

Jeśli wszystko jest OK, zobaczysz: ✅ KONFIGURACJA KOMPLETNA!

### 3. 🚀 Uruchom aplikację

```bash
python app.py
```
**LUB** kliknij przycisk **Run** w Replit

## 🔐 Dostęp Developer (pełny darmowy dostęp)

Po uruchomieniu automatycznie utworzone zostanie konto:
- **Username:** `developer`
- **Password:** `NewDev2024!`
- **Email:** `dev@cvoptimizer.pro`

To konto ma **pełny dostęp do wszystkich funkcji bez płatności**.

## 🌐 Dostęp do aplikacji

Aplikacja uruchomi się na:
- **Replit:** automatyczny URL w oknie przeglądarki
- **Local:** http://0.0.0.0:5000

## 📋 Status funkcji aplikacji

### ✅ Ukończone funkcje:
- **Backend:** Flask + SQLAlchemy + SQLite fallback
- **Frontend:** Modern glassmorphism UI
- **Uwierzytelnianie:** Flask-Login + bcrypt
- **Płatności:** Stripe integration (test mode)
- **AI Features:** OpenRouter API integration
- **PWA:** Service Worker + Manifest
- **Security:** CSRF protection, secure sessions
- **Rate limiting:** API call protection

### 🎯 Funkcje AI (OpenRouter):
1. **Optymalizacja CV** (9,99 PLN lub Premium)
2. **Opinia rekrutera** (Premium)
3. **List motywacyjny** (Premium)
4. **Sprawdzenie ATS** (9,99 PLN lub Premium)
5. **Pytania rekrutacyjne** (Premium)
6. **Analiza słów kluczowych** (Premium)
7. **Sprawdzenie gramatyki** (9,99 PLN lub Premium)
8. **Generator CV AI** (Premium)

### 💳 Model płatności:
- **9,99 PLN** - jednorazowa płatność za podstawowe funkcje
- **29,99 PLN/miesiąc** - Premium z pełnym dostępem
- **Developer account** - darmowy pełny dostęp

## 🔧 Rozwiązywanie problemów

### ❌ "Brakujące zmienne środowiskowe"
1. Sprawdź panel **Secrets** w Replit
2. Upewnij się, że wszystkie klucze są ustawione
3. Uruchom `python check_config.py`

### ❌ "OpenRouter API error"
1. Sprawdź poprawność `OPENROUTER_API_KEY`
2. Klucz musi zaczynać się od `sk-or-v1-`
3. Sprawdź saldo na https://openrouter.ai/

### ❌ "Stripe error"
1. Użyj kluczy testowych (zaczynają się od `sk_test_` i `pk_test_`)
2. Sprawdź https://dashboard.stripe.com/test/apikeys

### ⚠️ Port już używany
```bash
pkill -f python
python app.py
```

### 🗄️ Problemy z bazą danych
Aplikacja używa SQLite jako fallback - nie wymaga konfiguracji PostgreSQL.

## 📝 Dodatkowe konfiguracje (opcjonalne)

### Produkcja z PostgreSQL:
```
DATABASE_URL=postgresql://user:password@host:port/database
```

### Email notifications:
```
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

## 🎉 Gotowe!

1. ✅ Ustaw zmienne w Replit Secrets
2. ✅ Uruchom `python check_config.py`
3. ✅ Kliknij **Run** lub `python app.py`
4. ✅ Zaloguj się jako `developer` / `NewDev2024!`
5. ✅ Testuj wszystkie funkcje

**Aplikacja CV Optimizer Pro jest gotowa do użytku!** 🚀

## 📞 Pomoc techniczna

Jeśli masz problemy:
1. Sprawdź logi w konsoli Replit
2. Uruchom `python check_config.py` dla diagnostyki
3. Sprawdź czy wszystkie Secrets są ustawione

**Powodzenia z CV Optimizer Pro!** 💪
