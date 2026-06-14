from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import datetime
import sqlite3
import os

from database import DB_NAME
from database import init_db, insert_log, fetch_logs

app = Flask(__name__)
CORS(app)

init_db()

# =========================
# PATH
# =========================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DASHBOARD_DIR = os.path.join(BASE_DIR, "..", "dashboard")

print("🔥 Dashboard Path:", DASHBOARD_DIR)

# =========================
# CREATE SENSITIVE TABLE
# =========================
def init_sensitive_table():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensitive_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            detected TEXT,
            risk_score INTEGER,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()

init_sensitive_table()

# =========================
# NORMAL LOG (AI_ACCESS / BLOCK)
# =========================
@app.route("/log", methods=["POST"])
def log_event():
    data = request.json

    timestamp = data.get("timestamp") or datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    event_type = data.get("event")
    details = data.get("details", "")

    if not event_type:
        return jsonify({"error": "event missing"}), 400

    # 🔥 FIX: give AI_ACCESS default risk
    risk_score = int(data.get("risk_score", 10 if event_type == "AI_ACCESS" else 0))
    insert_log(timestamp, event_type, details, risk_score)

    return jsonify({"status": "logged"})

# =========================
# SENSITIVE LOG
# =========================
# =========================
# SENSITIVE LOG (FINAL FIX)
# =========================
@app.route('/log_sensitive', methods=['POST'])
def log_sensitive():
    try:
        data = request.json

        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()

        detected = data.get('detected', "")

        if isinstance(detected, list):
            detected = ",".join(detected)

        cursor.execute("""
            INSERT INTO sensitive_logs (content, detected, risk_score, timestamp)
            VALUES (?, ?, ?, ?)
        """, (
            data.get('details') or data.get('content') or '',   # ✅ FIXED (NOW MATCHES FRONTEND)
            detected,
            int(data.get('risk_score', 0)),
            data.get('timestamp')
        ))

        conn.commit()
        conn.close()

        return jsonify({"status": "success"})

    except Exception as e:
        return jsonify({"error": str(e)})
# =========================
# FETCH ALL LOGS (MERGED)
# =========================
@app.route('/all_logs', methods=['GET'])
def get_all_logs():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    # NORMAL
    cursor.execute("SELECT id, timestamp, event_type, details, risk_score FROM logs")
    normal_logs = cursor.fetchall()

    # SENSITIVE
    cursor.execute("SELECT id, content, detected, risk_score, timestamp FROM sensitive_logs")
    sensitive_logs = cursor.fetchall()

    conn.close()

    combined = []

    # NORMAL
    for row in normal_logs:
        combined.append({
            "type": "NORMAL",
            "id": row[0],
            "timestamp": row[1],
            "event": row[2],
            "details": row[3],
            "risk_score": row[4]
        })

    # SENSITIVE
    for row in sensitive_logs:
        detected_type = row[2] or ""

        event_name = (
            detected_type.split(",")[0].upper() + "_LEAK"
            if detected_type else "SENSITIVE"
        )

        combined.append({
            "type": "SENSITIVE",
            "id": row[0] + 100000,
            "timestamp": row[4],
            "event": event_name,
            "details": row[1],
            "risk_score": row[3]
        })

    # 🔥 SORT BY TIME (CORRECT)
    combined.sort(key=lambda x: x["timestamp"], reverse=True)

    return jsonify(combined)

# =========================
# FETCH NORMAL LOGS
# =========================
@app.route("/logs", methods=["GET"])
def get_logs():
    rows = fetch_logs()

    logs = []
    for row in rows:
        logs.append({
            "id": row[0],
            "timestamp": row[1],
            "event_type": row[2],
            "details": row[3],
            "risk_score": row[4]
        })

    return jsonify(logs)

# =========================
# FETCH SENSITIVE LOGS
# =========================
@app.route('/sensitive_logs', methods=['GET'])
def get_sensitive_logs():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, content, detected, risk_score, timestamp 
        FROM sensitive_logs 
        ORDER BY id DESC
    """)

    rows = cursor.fetchall()
    conn.close()

    logs = []
    for row in rows:
        logs.append({
            "id": row[0],
            "content": row[1],
            "detected": row[2],
            "risk_score": row[3],
            "timestamp": row[4]
        })

    return jsonify(logs)

# =========================
# DASHBOARD
# =========================
@app.route("/dashboard")
def dashboard():
    return send_from_directory(DASHBOARD_DIR, "index.html")

@app.route("/dashboard/<path:filename>")
def dashboard_files(filename):
    return send_from_directory(DASHBOARD_DIR, filename)

# =========================
# RUN
# =========================
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=True)
