from flask import Flask, request, jsonify, send_file
from flask import stream_with_context, Response
from utils import get_prediction
import os

UPLOAD_FOLDER = './uploads'
os.mkdir(UPLOAD_FOLDER)
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/hello')
def hello():
	return 'Hello World!'

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    filename = file.filename
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    response = jsonify({'success': True})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['file']
    result = get_prediction(file.read())
    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
