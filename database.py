import sqlite3
from datetime import datetime

DATABASE = 'guests.db'


def init_db():
    """Инициализация базы данных"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS guests
                   (
                       id
                       INTEGER
                       PRIMARY
                       KEY
                       AUTOINCREMENT,
                       first_name
                       TEXT
                       NOT
                       NULL,
                       last_name
                       TEXT
                       NOT
                       NULL,
                       will_attend
                       BOOLEAN
                       NOT
                       NULL,
                       guests_count
                       INTEGER
                       DEFAULT
                       1,
                       message
                       TEXT,
                       created_at
                       TIMESTAMP
                       DEFAULT
                       CURRENT_TIMESTAMP
                   )
                   ''')
    conn.commit()
    conn.close()


def add_guest(first_name, last_name, will_attend, guests_count=1, message=''):
    """Добавление гостя в базу данных"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
                   INSERT INTO guests (first_name, last_name, will_attend, guests_count, message)
                   VALUES (?, ?, ?, ?, ?)
                   ''', (first_name, last_name, will_attend, guests_count, message))
    conn.commit()
    conn.close()


def get_all_guests():
    """Получение списка всех гостей"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM guests ORDER BY created_at DESC')
    guests = cursor.fetchall()
    conn.close()
    return guests


def get_statistics():
    """Статистика по гостям"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()

    cursor.execute('SELECT COUNT(*) FROM guests WHERE will_attend = 1')
    attending = cursor.fetchone()[0]

    cursor.execute('SELECT SUM(guests_count) FROM guests WHERE will_attend = 1')
    total_guests = cursor.fetchone()[0] or 0

    cursor.execute('SELECT COUNT(*) FROM guests WHERE will_attend = 0')
    not_attending = cursor.fetchone()[0]

    conn.close()
    return {
        'attending': attending,
        'total_guests': total_guests,
        'not_attending': not_attending
    }