
#!/usr/bin/env python3
"""
CV Optimizer Pro - Quick Setup Script
Automatyczne ustawienie aplikacji
"""

import os
import sys
from dotenv import load_dotenv

def setup_application():
    """Setup aplikacji krok po kroku"""
    
    print("🚀 CV OPTIMIZER PRO - SETUP")
    print("="*50)
    
    # Check if .env exists
    if not os.path.exists('.env'):
        print("📝 Tworzę plik .env...")
        create_env_template()
    
    # Load environment
    load_dotenv(override=True)
    
    # Check configuration
    print("\n🔧 Sprawdzam konfigurację...")
    
    critical_vars = ['OPENROUTER_API_KEY', 'STRIPE_SECRET_KEY', 'SECRET_KEY']
    missing = []
    
    for var in critical_vars:
        value = os.environ.get(var, '').strip()
        if not value or value.startswith('TWÓJ_') or value.startswith('your-'):
            missing.append(var)
    
    if missing:
        print(f"\n⚠️  Ustaw te zmienne w Replit Secrets: {', '.join(missing)}")
        print("\n📋 Instrukcje:")
        print("1. Otwórz panel 'Secrets' w Replit")
        print("2. Dodaj wymagane klucze API")
        print("3. Uruchom ponownie setup: python setup.py")
        return False
    
    print("✅ Konfiguracja OK!")
    
    # Initialize database
    print("\n🗄️ Inicjalizuję bazę danych...")
    try:
        from app import initialize_app
        initialize_app()
        print("✅ Baza danych gotowa!")
    except Exception as e:
        print(f"❌ Błąd bazy danych: {e}")
        return False
    
    print("\n🎉 SETUP ZAKOŃCZONY POMYŚLNIE!")
    print("\n🔐 Konto Developer:")
    print("   Username: developer")
    print("   Password: NewDev2024!")
    print("\n🚀 Uruchom aplikację: python app.py")
    
    return True

def create_env_template():
    """Utwórz szablon pliku .env"""
    
    template = """# =====================================================
# CV OPTIMIZER PRO - CONFIGURATION TEMPLATE
# =====================================================
# 
# 🔧 INSTRUKCJA:
# 1. Wypełnij poniższe wartości
# 2. Lub ustaw je w Replit Secrets (zalecane)
# 3. Uruchom: python check_config.py
#

# 🔑 OpenRouter API Key (WYMAGANE)
# Uzyskaj za darmo: https://openrouter.ai/
OPENROUTER_API_KEY=TWÓJ_OPENROUTER_API_KEY_TUTAJ

# 💳 Stripe Keys (WYMAGANE dla płatności)
# https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY=TWÓJ_STRIPE_SECRET_KEY_TUTAJ
VITE_STRIPE_PUBLIC_KEY=TWÓJ_STRIPE_PUBLIC_KEY_TUTAJ

# 🔐 Security (WYMAGANE)
SECRET_KEY=cv-optimizer-super-secret-key-2024-change-me

# 🗄️ Database (opcjonalne - używa SQLite domyślnie)
DATABASE_URL=sqlite:////tmp/cv_optimizer.db

# 🌐 App Configuration
FLASK_ENV=production
DEBUG=false
PORT=5000
"""
    
    with open('.env', 'w') as f:
        f.write(template)
    
    print("✅ Utworzono szablon .env")

if __name__ == '__main__':
    try:
        success = setup_application()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"❌ Błąd setup: {e}")
        sys.exit(1)
