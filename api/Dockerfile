FROM python:3.7.5
RUN pip3 install torch==1.6.0+cpu torchvision==0.7.0+cpu -f https://download.pytorch.org/whl/torch_stable.html
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip3 install -r requirements.txt
COPY app/ /app
ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]
EXPOSE 5000
