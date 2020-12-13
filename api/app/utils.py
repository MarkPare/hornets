import io
import json
import torch
from torch import nn
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
from uuid import uuid4
from flask import current_app as app
import os
import sys
import time

cwd = os.getcwd()
class_names = ['vespa_mandarinia', 'sphecius_speciosus', 'sphex_ichneumoneus']

def get_id():
    return str(uuid4())

def get_model():
    model = models.resnet18(pretrained=True)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, len(class_names))
    model_weights_path = './model_state_dicts/first.pkl'
    state_dict = torch.load(model_weights_path, map_location='cuda:0' if torch.cuda.is_available() else 'cpu')
    model.load_state_dict(state_dict)
    model.eval()
    return model

main_model = get_model()

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
    main_model = get_model()
    tensor = transform_image(image_bytes)
    outputs = main_model(tensor)
    _, y_hat = outputs.max(1)
    predicted_index = y_hat.item()
    prediction = class_names[predicted_index]
    return {'prediction': prediction}
