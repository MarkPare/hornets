FROM node:12.16-alpine
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /app
RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++ \
  && npm install \
  && apk del build-dependencies
COPY ./package.json ./
RUN npm config set unsafe-perm true
RUN npm install -g serve
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD serve -l 3000 -s /app/build
