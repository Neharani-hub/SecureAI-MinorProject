import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_NAME = os.path.join(BASE_DIR, "shadowai.db")

print("Database path:", DB_NAME)


def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            event_type TEXT,
            details TEXT,
            risk_score INTEGER
        )
    """)

    conn.commit()
    conn.close()


def insert_log(timestamp, event_type, details, risk_score):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO logs (timestamp, event_type, details, risk_score) VALUES (?, ?, ?, ?)",
        (timestamp, event_type, details, risk_score)
    )

    conn.commit()
    conn.close()


def fetch_logs():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM logs ORDER BY id DESC LIMIT 200")

    rows = cursor.fetchall()
    conn.close()

    return rowsx
