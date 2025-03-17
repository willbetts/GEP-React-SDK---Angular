from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

access_token = os.getenv("GUSTO_ACCESS_TOKEN")  # Use an environment variable for the access token
base_url = "https://api.gusto-demo.com"  # Base URL for Gusto API

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})  # Allow requests from your frontend

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

GUSTO_API_VERSION = "2024-11-08"
HEADERS = {
    "X-Gusto-API-Version": GUSTO_API_VERSION,
    "Content-Type": "application/json",
    "Accept": "application/json"
}

@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE'])
def proxy(path):
    method = request.method
    url = f"{base_url}/{path}"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "X-Gusto-API-Version": GUSTO_API_VERSION,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    data = request.json if method in ['POST', 'PUT'] else None

    logger.info("Proxying %s request to Gusto API with URL: %s", method, url)
    if data:
        logger.info("Request data: %s", data)

    try:
        response = requests.request(method, url, headers=headers, json=data)
        response.raise_for_status()
        logger.info("Received response from Gusto API with status code: %s", response.status_code)
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        logger.error("Error communicating with Gusto API: %s", str(e))
        if e.response is not None:
            logger.error("Response content: %s", e.response.content)
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        logger.error("Unexpected error: %s", str(e))
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == "__main__":
    app.run(debug=True)
