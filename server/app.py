import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai_client import client

app = Flask(__name__)
CORS(app)

@app.route("/api/summarize-file", methods=["POST"])
def summarize_file():
    uploaded = request.files.get("file")
    prompt = request.form.get("prompt", "Summarize this document in a simple way. Make it so the general public can understand it.")

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

    return jsonify({"summary": response.output_text})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)