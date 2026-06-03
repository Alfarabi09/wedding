import urllib.request
import urllib.parse
from datetime import datetime

# Google Apps Script webhook URL
WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyemRDpT38YNZz_U7cJjutLzDHCCnlHio_x2RqqVvijfT0nbmEaQsxze7slv-mPMGWZnA/exec'


def sync_guest_to_sheets(first_name, last_name, will_attend, guests_count, message):
    """Отправить данные гостя в Google Sheet через webhook (form-data)"""
    try:
        attendance = 'Да' if will_attend else 'Нет'
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Формируем данные как URL-encoded form
        data = urllib.parse.urlencode({
            'timestamp': timestamp,
            'firstName': first_name,
            'lastName': last_name,
            'attendance': attendance,
            'guestCount': guests_count,
            'message': message
        }).encode('utf-8')
        
        # Отправляем POST запрос
        req = urllib.request.Request(
            WEBHOOK_URL,
            data=data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            method='POST'
        )
        
        with urllib.request.urlopen(req) as response:
            result = response.read().decode('utf-8')
            print(f"Гость добавлен в таблицу: {first_name} {last_name}")
            return True
    
    except Exception as e:
        print(f"Ошибка при синхронизации с Google Sheets: {e}")
        return False


def init_sheets_headers():
    """Инициализировать заголовки в Google Sheet"""
    # Заголовки создаются автоматически в Google Apps Script
    # Эта функция оставлена для совместимости
    return True

