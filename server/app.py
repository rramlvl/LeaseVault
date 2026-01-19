import base64
import os
from functools import wraps

from flask import Flask, request, jsonify
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials, auth as fb_auth

from openai_client import client

app = Flask(__name__)
CORS(app)

# ---- Firebase Admin init (do this once) ----
# Option A (recommended for dev): point to your service account JSON path
SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)


def require_firebase_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing Authorization Bearer token"}), 401

        token = header.split("Bearer ", 1)[1].strip()
        if not token:
            return jsonify({"error": "Empty Bearer token"}), 401

        try:
            decoded = fb_auth.verify_id_token(token)
            request.user = decoded  # contains uid, email, etc.
        except Exception:
            return jsonify({"error": "Invalid or expired token"}), 401

        return fn(*args, **kwargs)

    return wrapper


@app.route("/api/summarize-file", methods=["POST"])
@require_firebase_auth
def summarize_file():
    # Trusted identity from Firebase
    uid = request.user.get("uid")

    uploaded = request.files.get("file")
    prompt = request.form.get(
        "prompt",
        "Summarize this document in a simple way. Make it so the general public can understand it."
    )

    if not uploaded:
        return jsonify({"error": "file is required"}), 400

    file_bytes = uploaded.read()
    b64 = base64.b64encode(file_bytes).decode("ascii")
    mime = uploaded.mimetype or "application/octet-stream"
    data_url = f"data:{mime};base64,{b64}"

    response = client.responses.create(
        model="gpt-4o-mini",
        input=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "filename": uploaded.filename,
                        "file_data": data_url
                    },
                    {
                        "type": "input_text",
                        "text": prompt
                    }
                ]
            }
        ]
    )

    # You can log uid for audit trails later if you want:
    # print(f"Summarized for uid={uid}, file={uploaded.filename}")

    return jsonify({"summary": response.output_text})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
