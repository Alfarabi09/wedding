from flask import Flask, render_template, request, jsonify
from database import init_db, add_guest, get_all_guests, get_statistics

app = Flask(__name__)

# Инициализация базы данных при запуске
init_db()


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

    add_guest(first_name, last_name, will_attend, guests_count, message)

    response_message = (
        'Спасибо за ваш ответ! Мы ждём вас на нашем празднике! 💕'
        if will_attend
        else 'Спасибо за ответ! Мы будем скучать без вас 💔'
    )

    return jsonify({
        'success': True,
        'message': response_message
    })


@app.route('/admin/guests')
def admin_guests():
    """Страница администратора для просмотра гостей"""
    guests = get_all_guests()
    stats = get_statistics()
    return jsonify({
        'guests': guests,
        'statistics': stats
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)