from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api', methods=['GET'])
def api():
    return jsonify({'message': 'Hello World!'})

if __name__ == '__main__':
    app.run(port=7777)