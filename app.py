from flask import Flask, render_template, request, jsonify, send_file
import os
from sheets_sync import sync_guest_to_sheets, init_sheets_headers
from database import add_guest
from threading import Thread

app = Flask(__name__)

# Инициализация Google Sheets при запуске
init_sheets_headers()

# Создаём папку для шрифтов если её нет
os.makedirs(os.path.join(app.static_folder, 'fonts'), exist_ok=True)

# Копируем шрифт при запуске
font_src = os.path.join(os.path.dirname(__file__), 'PassionsConflictRUS-Regular.otf')
font_dst = os.path.join(app.static_folder, 'fonts', 'PassionsConflictRUS-Regular.otf')
if os.path.exists(font_src) and not os.path.exists(font_dst):
    import shutil
    shutil.copy(font_src, font_dst)


@app.route('/')
def index():
    """Главная страница с приглашением"""
    return render_template('index.html', lang='ru')


@app.route('/rsvp', methods=['POST'])
def rsvp():
    """Обработка ответа гостя"""
    data = request.json

    first_name = data.get('firstName', '').strip()
    last_name = data.get('lastName', '').strip()
    will_attend = data.get('willAttend', False)
    guests_count = int(data.get('guestsCount', 1))
    message = data.get('message', '').strip()

    if not first_name or not last_name:
        error_message = 'Пожалуйста, заполните имя и фамилию'
        return jsonify({'success': False, 'error': error_message, 'message': error_message}), 400

    # Сохраняем в локальную БД синхронно для быстрого ответа
    add_guest(first_name, last_name, will_attend, guests_count, message)

    response_message = (
        'Спасибо за ваш ответ! Мы ждём вас на нашем празднике! 💕'
        if will_attend
        else 'Спасибо за ответ! Мы будем скучать без вас 💔'
    )

    # Отправляем в Google Sheets в фоне (асинхронно)
    thread = Thread(
        target=sync_guest_to_sheets,
        args=(first_name, last_name, will_attend, guests_count, message)
    )
    thread.daemon = True
    thread.start()

    return jsonify({
        'success': True,
        'message': response_message
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
