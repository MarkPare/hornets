rm -rf app/model_state_dicts || true
mkdir app/model_state_dicts
curl "https://storage.googleapis.com/mp-general-storage/weights.pkl" > ./model_state_dicts/model.pkl

if [ "$APP_ENV" == "prod" ]
then
  gunicorn -b 0.0.0.0:5000 --access-logfile - app:app
else
  python app.py
fi
