# Asian giant hornet detector

A simple app that leverages neural networks to classify images of the Asian giant hornet (vespa mandarinia) and 5 other hymenoptera that look similar.

Checkout the [notebook](hornets/hornets.ipynb) for more information on model architecture and data sourcing.

Aside from the model, the application consists of a Flask API that receives image uploads and returns a prediction, and a React web client.

App is deployed using Kubernetes on GKE / GCP.
