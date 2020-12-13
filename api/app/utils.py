import io
import json
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from uuid import uuid4
from flask import current_app as app
import os
import sys
import time

def get_id(): return str(uuid4())

model = models.densenet121(pretrained=True)
model.eval()
cwd = os.getcwd()
class_names = ['vespa_mandarinia', 'sphecius_speciosus', 'sphex_ichneumoneus']

def transform_image(image_bytes):
    # TODO: check that these transforms are legit and correct
    ts = transforms.Compose([
        transforms.Resize(255),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    image = Image.open(io.BytesIO(image_bytes))
    return ts(image).unsqueeze(0)

def get_prediction(image_bytes):
    tensor = transform_image(image_bytes)
    outputs = model.forward(tensor)
    _, y_hat = outputs.max(1)
    print('y hat', y_hat)
    predicted_index = str(y_hat.item())
    result = class_names[predicted_index]
    prediction = class_names[predicted_index]
    return {'prediction': prediction, 'full_results': y_hat}
