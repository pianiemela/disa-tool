
FROM node:8.9.1

COPY . ./
WORKDIR ./

RUN npm install

RUN node ./src/database/create_data.js

EXPOSE 8000

CMD ["npm", "run", "start-dev"]