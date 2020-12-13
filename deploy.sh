#!/bin/bash

read -p "Are you sure you want to deploy? y/n: " USER_RESPONSE

if [ "$USER_RESPONSE" != "y" ]
then
  echo "Aborting deploy..."
  exit 0
fi

echo "Running build and deploy script..."

EXPECTED_PROJECT_ID="learn-217205"
PROJECT_ID=$(gcloud config get-value project)
EXPECTED_CONTEXT="gke_learn-217205_us-west1-a_prod-cluster"
CONTEXT=$(kubectl config current-context)

if [ "$PROJECT_ID" != "$EXPECTED_PROJECT_ID" ]
then
  echo "Gcloud project id is incorrect. Aborting build..."
  exit 1
fi

if [ "$CONTEXT" != "$EXPECTED_CONTEXT" ]
then
  echo "kubectl context is incorrect. Aborting build..."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

COMMIT_ID="$(git rev-parse --short=7 HEAD)"

echo "Checked out to $CURRENT_BRANCH"

echo "Commit ID is $COMMIT_ID"


########
# SERVER
########
echo "Building and pushing Hornets API..."

gcloud builds submit --config api/cloudbuild.yaml api --substitutions=SHORT_SHA=$COMMIT_ID

echo "prev output $?"

if [ $? != 0 ]
then
  echo "Failed to build and push server"
  exit 1
fi

echo "Hornets API built and pushed"

########
# CLIENT
########
echo "Building and pushing client..."

gcloud builds submit --config web/cloudbuild.yaml web --substitutions=SHORT_SHA=$COMMIT_ID

echo "prev output $?"

if [ $? != 0 ]
then
  echo "Failed to build and push client"
  exit 1
fi

echo "Client built and pushed"


###########
# K8s files
###########
rm -rf k8s-tmp || true

cp -R k8s k8s-tmp

SERVER_FILE_PATH="k8s-tmp/hornets.yaml"
SERVER_COMPONENT_NAME="hornets"
CLIENT_FILE_PATH="k8s-tmp/hornets-client.yaml"
CLIENT_COMPONENT_NAME="hornets-client"

sed -i.bak "s#gcr.io/${PROJECT_ID}/${SERVER_COMPONENT_NAME}:latest#gcr.io/${PROJECT_ID}/${SERVER_COMPONENT_NAME}:${COMMIT_ID}#" "$SERVER_FILE_PATH"

sed -i.bak "s#gcr.io/${PROJECT_ID}/${CLIENT_COMPONENT_NAME}:latest#gcr.io/${PROJECT_ID}/${CLIENT_COMPONENT_NAME}:${COMMIT_ID}#" "$CLIENT_FILE_PATH"

rm k8s-tmp/*.bak

kubectl apply -f k8s-tmp

if [ $? != 0 ]
then
  echo "Failed to apply k8s manifests. Deploy failed..."
  exit 1
fi

echo "Successfully deployed"
