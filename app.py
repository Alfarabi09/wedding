from flask import Flask, render_template, request, jsonify
from sheets_sync import sync_guest_to_sheets, init_sheets_headers

app = Flask(__name__)

# Инициализация Google Sheets при запуске
init_sheets_headers()


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

    # Отправляем гостя сразу в Google Sheets
    sync_success = sync_guest_to_sheets(first_name, last_name, will_attend, guests_count, message)

    response_message = (
        'Спасибо за ваш ответ! Мы ждём вас на нашем празднике! 💕'
        if will_attend
        else 'Спасибо за ответ! Мы будем скучать без вас 💔'
    )

    return jsonify({
        'success': sync_success,
        'message': response_message
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
