# Asian giant hornet detector

A simple app that leverages neural networks to classify images of the Asian giant hornet (vespa mandarinia) and 5 other hymenoptera that look similar. [App is live here](https://app.asian-giant-hornet.com).

Checkout the [notebook](hornets/hornets.ipynb) for more information on model architecture and data sourcing. Draws heavily from [this pytorch tutorial](https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html).

Aside from the model, the application consists of a Flask API that receives image uploads and returns a prediction, and a React web client. The web client also serves as a user interface for manually cleaning up raw image data in an efficient way (full functionality for this depends on some local file structure handling not fully documented here).

App is deployed using Kubernetes on GKE / GCP.

## Note from author
Would love to see this tool improve! If you're interested in collaborating or have additional data, please contact me.
