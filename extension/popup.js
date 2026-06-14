<!DOCTYPE html>
<html>
<head>
    <title>SecureAI</title>
    <style>
        body {
            font-family: Arial;
            width: 260px;
            padding: 15px;
            text-align: center;
            background: #0f172a;
            color: #e2e8f0;
            position: relative;
        }

        h3 { color: #38bdf8; }

        img {
            width: 60px;
            margin-bottom: 10px;
        }

        input {
            width: 100%;
            padding: 8px;
            margin-top: 8px;
            border-radius: 6px;
            border: none;
            background: #1e293b;
            color: white;
        }

        button {
            width: 100%;
            padding: 8px;
            margin-top: 8px;
            border: none;
            border-radius: 6px;
            background: #38bdf8;
            color: black;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover { background: #0ea5e9; }

        .hidden { display: none; }

        /* MENU */
        .menu {
            position: absolute;
            top: 10px;
            right: 10px;
            font-size: 20px;
            cursor: pointer;
            color: #38bdf8;
        }

        .dropdown {
            position: absolute;
            top: 35px;
            right: 10px;
            background: #1e293b;
            border: 1px solid #38bdf8;
            border-radius: 6px;
            width: 150px;
            display: none;
        }

        .dropdown div {
            padding: 10px;
            cursor: pointer;
        }

        .dropdown div:hover { background: #334155; }

        /* TOGGLE */
        .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 26px;
            margin-top: 10px;
        }

        .switch input { display: none; }

        .slider {
            position: absolute;
            cursor: pointer;
            background-color: #334155;
            border-radius: 34px;
            top: 0; left: 0; right: 0; bottom: 0;
            transition: 0.3s;
        }

        .slider:before {
            content: "";
            position: absolute;
            height: 20px;
            width: 20px;
            left: 3px;
            bottom: 3px;
            background: #38bdf8;
            border-radius: 50%;
            transition: 0.3s;
        }

        input:checked + .slider {
            background-color: #22c55e;
        }

        input:checked + .slider:before {
            transform: translateX(24px);
        }

        #status {
            margin-top: 10px;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <img src="logo.png.jpeg">

    <!-- MENU -->
    <div class="menu hidden" id="menuBtn">&#8942;</div>
    <div class="dropdown" id="menuDropdown">
        <div id="changePassBtn">Change Password</div>
        <div id="removePassBtn">Remove Password</div>
    </div>

    <!-- SET PASSWORD -->
    <div id="setupScreen" class="hidden">
        <h3>Set Password</h3>
        <input type="password" id="newPassword" placeholder="Create password">
        <button id="savePassword">Save</button>
    </div>

    <!-- LOGIN -->
    <div id="loginScreen" class="hidden">
        <h3>Enter Password</h3>
        <input type="password" id="loginPassword" placeholder="Enter password">
        <button id="loginBtn">Unlock</button>
    </div>

    <!-- CONTROL -->
    <div id="controlScreen" class="hidden">
        <h3>SecureAI</h3>

        <label class="switch">
            <input type="checkbox" id="toggleSwitch">
            <span class="slider"></span>
        </label>

        <p id="status"></p>
    </div>

    <!-- CHANGE PASSWORD -->
    <div id="changeScreen" class="hidden">
        <h3>Change Password</h3>
        <input type="password" id="oldPass" placeholder="Old password">
        <input type="password" id="newPass" placeholder="New password">
        <button id="updatePass">Update</button>
    </div>

    <script src="popup.js"></script>
</body>
</html>