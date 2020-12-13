from flask import Flask, request, jsonify, send_file
from flask import stream_with_context, Response
from .utils.utils import get_prediction
app = Flask(__name__)

@app.route('/hello')
def hello():
  return 'Hello World!'

@app.route('/predict', methods=['POST'])
def predict():
  file = request.files['file']
  result = get_prediction(file.read())
  response = jsonify(result)
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=5000)
