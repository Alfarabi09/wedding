import requests
from datetime import datetime

# Твой URL веб-приложения Google (обязательно обнови после передеплоя!)
WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwwMwF6w7cIb-1wkU-DiM5w9wIXy8bAaf6gLKleeA3xUOE-6faV0qnw5D-BerJc9HRNjg/exec'


def sync_guest_to_sheets(first_name, last_name, will_attend, guests_count, message):
    """Отправить данные гостя в Google Sheet через webhook (form-data)"""
    try:
        attendance = 'Да' if will_attend else 'Нет'
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Формируем данные формы
        payload = {
            'timestamp': timestamp,
            'firstName': first_name,
            'lastName': last_name,
            'attendance': attendance,
            'guestCount': guests_count,
            'message': message
        }
        
        # requests сам правильно кодирует в application/x-www-form-urlencoded 
        # и корректно следует за редиректами Google (302)
        response = requests.post(WEBHOOK_URL, data=payload, timeout=10)
        
        if response.status_code == 200 and "Ошибка" not in response.text:
            print(f"Гость добавлен в таблицу: {first_name} {last_name}. Ответ Google: {response.text}")
            return True
        else:
            print(f"Google вернул ошибку или некорректный статус: {response.status_code}, Текст: {response.text}")
            return False
            
    except Exception as e:
        print(f"Ошибка при синхронизации с Google Sheets: {e}")
        return False


def init_sheets_headers():
    return True