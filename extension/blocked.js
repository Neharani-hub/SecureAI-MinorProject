<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Access Restricted</title>

    <style>
        body {
            margin: 0;
            background: linear-gradient(135deg, #0f172a, #111827);
            color: white;
            font-family: "Segoe UI", Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }

        .container {
            background-color: #1e293b;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.3);
            width: 420px;
        }

        h1 {
            color: #ef4444;
            margin-bottom: 10px;
        }

        p {
            color: #cbd5e1;
        }

        .badge {
            margin-top: 20px;
            padding: 10px 18px;
            background-color: #ef4444;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
        }

        .student-info {
            margin-top: 20px;
            font-size: 14px;
            color: #94a3b8;
        }

        .countdown {
            margin-top: 25px;
            font-size: 18px;
            font-weight: bold;
            color: #facc15;
        }
    </style>
</head>

<body>

<div class="container">
    <h1>Restricted Mode Active</h1>
    <p>Access to AI-powered platforms is restricted during this session.</p>

    <div class="badge">
        AI Access Blocked
    </div>

   

    <div class="countdown">
        <p>Closing in <span id="timer">3</span>...</p>
    </div>
</div>

<script src="blocked.js">

setTimeout(() => {
    chrome.runtime.sendMessage("close_tab");
}, 3000);
</script>

</body>
</html>