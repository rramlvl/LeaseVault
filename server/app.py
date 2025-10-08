from flask import Flask, jsonify, request
from flask_cors import CORS
import os

def create_app():
    app = Flask(__name__)
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret")

    # Allow Angular to talk to Flask during local dev
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.get("/api/health")
    def health():
        return jsonify(status="ok")

    @app.get("/api/hello")
    def hello():
        name = request.args.get("name", "world")
        return jsonify(message=f"Hello, {name}!")

    @app.post("/api/echo")
    def echo():
        data = request.get_json(silent=True) or {}
        return jsonify(received=data), 201

    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)