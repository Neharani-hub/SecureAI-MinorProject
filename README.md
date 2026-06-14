# 🔐 SecureAI – AI Security Monitoring System

SecureAI – Real-Time AI Usage Monitoring and Security Dashboard using Chrome Extension, Flask, and Risk Analytics.

---

## 🚀 Features

* 🔍 AI Website Monitoring (ChatGPT, Gemini, Claude, Perplexity)
* 🚫 Blocking Mode (Exam Mode)
* 🔐 Sensitive Data Detection (passwords, emails, API keys, etc.)
* 📊 Real-time Dashboard with Risk Analysis
* 📈 Risk Scoring System

---

## 🛠️ Tech Stack

* Frontend: HTML, CSS, JavaScript
* Backend: Flask (Python)
* Database: SQLite
* Extension: Chrome Extension (Manifest V3)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/Neharani-hub/SecureAI.git
cd SecureAI-MinorProject/backend
```

---

### 2. Create Virtual Environment

**Windows:**

```
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**

```
python3 -m venv venv
source venv/bin/activate
```

---

### 3. Install Dependencies

```
pip install -r requirements.txt
```

---

### 4. Run Backend

```
python app.py
```

---

### 5. Open Dashboard

```
http://127.0.0.1:5050/dashboard
```

---

### 6. Load Chrome Extension

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` folder

---

## 🧪 Testing

* Open ChatGPT / Gemini / Claude / Perplexity
* Logs appear in dashboard
* Enable exam mode → site blocked
* Enter sensitive data → detection triggered

---
## Dashboard Overview
![Dashboard](screenshots/dashboard.png)

## Chrome Extension
![Extension](screenshots/extension.png)

## AI Access Detection
![Detection](screenshots/detection.png)

## 📌 Future Improvements

* Machine Learning-based detection
* Multi-user authentication system
* Cloud deployment

---

## 👨‍💻 Author

* Neharani Peddinti


---
