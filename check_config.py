
#!/usr/bin/env python3
"""
CV Optimizer Pro - Configuration Checker
Sprawdza wszystkie wymagane zmienne środowiskowe i konfigurację
"""

import os
import sys
from dotenv import load_dotenv

def check_configuration():
    """Sprawdź kompletną konfigurację aplikacji"""
    
    # Load environment variables
    load_dotenv(override=True)
    
    print("\n" + "="*70)
    print("🔧 CV OPTIMIZER PRO - SPRAWDZANIE KONFIGURACJI")
    print("="*70)
    
    # Critical environment variables
    critical_vars = {
        'OPENROUTER_API_KEY': {
            'required': True,
            'description': 'OpenRouter API key for AI features',
            'example': 'sk-or-v1-...',
            'url': 'https://openrouter.ai/'
        },
        'STRIPE_SECRET_KEY': {
            'required': True,
            'description': 'Stripe secret key for payments',
            'example': 'sk_test_...',
            'url': 'https://dashboard.stripe.com/test/apikeys'
        },
        'VITE_STRIPE_PUBLIC_KEY': {
            'required': True,
            'description': 'Stripe public key for frontend',
            'example': 'pk_test_...',
            'url': 'https://dashboard.stripe.com/test/apikeys'
        },
        'SECRET_KEY': {
            'required': True,
            'description': 'Flask secret key for sessions',
            'example': 'your-secret-key-here',
            'url': None
        }
    }
    
    # Optional variables
    optional_vars = {
        'DATABASE_URL': {
            'description': 'Database connection string',
            'default': 'sqlite:////tmp/cv_optimizer.db'
        },
        'ENCRYPTION_KEY': {
            'description': 'Encryption key for sensitive data',
            'default': 'Auto-generated'
        }
    }
    
    print("\n📋 SPRAWDZANIE KRYTYCZNYCH ZMIENNYCH:")
    print("-" * 50)
    
    missing_critical = []
    invalid_critical = []
    
    for var_name, config in critical_vars.items():
        value = os.environ.get(var_name, '').strip()
        
        if not value:
            print(f"❌ {var_name}: BRAK")
            missing_critical.append(var_name)
        elif value.startswith('TWÓJ_') or value.startswith('your-') or len(value) < 10:
            print(f"⚠️  {var_name}: PRZYKŁADOWA WARTOŚĆ")
            invalid_critical.append(var_name)
        else:
            # Additional validation
            if var_name == 'OPENROUTER_API_KEY' and not value.startswith('sk-or-v1-'):
                print(f"⚠️  {var_name}: NIEPOPRAWNY FORMAT")
                invalid_critical.append(var_name)
            elif var_name.startswith('STRIPE_') and len(value) < 20:
                print(f"⚠️  {var_name}: ZA KRÓTKI")
                invalid_critical.append(var_name)
            else:
                print(f"✅ {var_name}: OK (długość: {len(value)})")
    
    print("\n📋 SPRAWDZANIE OPCJONALNYCH ZMIENNYCH:")
    print("-" * 50)
    
    for var_name, config in optional_vars.items():
        value = os.environ.get(var_name, '').strip()
        if value:
            print(f"✅ {var_name}: OK")
        else:
            print(f"ℹ️  {var_name}: UŻYWA DOMYŚLNEJ ({config['default']})")
    
    # Overall status
    print("\n" + "="*70)
    
    if missing_critical or invalid_critical:
        print("❌ KONFIGURACJA NIEKOMPLETNA!")
        
        if missing_critical:
            print(f"\n🔧 BRAKUJĄCE ZMIENNE: {', '.join(missing_critical)}")
            
        if invalid_critical:
            print(f"\n⚠️  NIEPOPRAWNE ZMIENNE: {', '.join(invalid_critical)}")
            
        print("\n📝 INSTRUKCJE NAPRAWY:")
        print("-" * 30)
        
        for var_name in missing_critical + invalid_critical:
            if var_name in critical_vars:
                config = critical_vars[var_name]
                print(f"\n🔑 {var_name}:")
                print(f"   Opis: {config['description']}")
                print(f"   Przykład: {config['example']}")
                if config['url']:
                    print(f"   Uzyskaj tutaj: {config['url']}")
                    
        print(f"\n🔧 EDYTUJ PLIK .env I USTAW PRAWIDŁOWE WARTOŚCI")
        print("🔄 Następnie uruchom ponownie: python check_config.py")
        
        return False
        
    else:
        print("✅ KONFIGURACJA KOMPLETNA!")
        print("\n🚀 APLIKACJA GOTOWA DO URUCHOMIENIA!")
        print("📌 Uruchom aplikację: python app.py")
        print("🌐 Lub kliknij przycisk 'Run' w Replit")
        
        print("\n🔐 KONTO DEVELOPER (darmowy dostęp):")
        print("   Username: developer")
        print("   Password: NewDev2024!")
        print("   Email: dev@cvoptimizer.pro")
        
        return True

def main():
    """Main function"""
    try:
        success = check_configuration()
        sys.exit(0 if success else 1)
        
    except Exception as e:
        print(f"\n❌ BŁĄD: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
