rm -rf app/model_state_dicts || true
mkdir app/model_state_dicts
curl "https://storage.googleapis.com/mp-general-storage/first.pkl" > ./model_state_dicts/model.pkl

gunicorn -b 0.0.0.0:5000 --access-logfile - app:app
