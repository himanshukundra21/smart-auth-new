from flask import Flask, request, jsonify, render_template
import face_recognition
import numpy as np
import base64
import cv2

app = Flask(__name__)

users = {}

def base64_to_image(base64_str):
    img_data = base64.b64decode(base64_str.split(',')[1])
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

@app.route('/')
def home():
    return render_template("login.html")

@app.route('/register')
def register_page():
    return render_template("register.html")

@app.route('/dashboard')
def dashboard():
    return render_template("welcome.html")

# REGISTER
@app.route('/register-user', methods=['POST'])
def register_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    image = data.get('image')

    if not email or not password or not image:
        return jsonify({"status": "fail", "msg": "Missing data"})

    img = base64_to_image(image)
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        return jsonify({"status": "fail", "msg": "No face found"})

    users[email] = {
        "face": encodings[0],
        "password": password
    }

    return jsonify({"status": "success"})

# PASSWORD LOGIN
@app.route('/login-user', methods=['POST'])
def login_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if email not in users:
        return jsonify({"status": "fail", "msg": "User not found"})

    if users[email]["password"] == password:
        return jsonify({"status": "success", "user": email})
    else:
        return jsonify({"status": "fail", "msg": "Wrong password"})

# FACE LOGIN
@app.route('/login-face', methods=['POST'])
def login_face():
    data = request.get_json()
    image = data.get('image')

    img = base64_to_image(image)
    encodings = face_recognition.face_encodings(img)

    if len(encodings) == 0:
        return jsonify({"status": "fail", "msg": "No face found"})

    user_face = encodings[0]

    for email, user_data in users.items():
        result = face_recognition.compare_faces(
            [user_data["face"]],
            user_face,
            tolerance=0.5
        )

        if result[0]:
            return jsonify({"status": "success", "user": email})

    return jsonify({"status": "fail", "msg": "Face not match"})

if __name__ == "__main__":
    app.run(debug=True)