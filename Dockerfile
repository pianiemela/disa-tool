FROM node:8.9.1

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app/frontend

RUN npm install

RUN npm run build

WORKDIR /usr/src/app/backend

RUN rm -r /usr/src/app/frontend

RUN npm install

EXPOSE 8000

CMD ["npm", "start"]
