# disa-tool

DISA-tool is web application designed to help the usage of digital self-assessment forms.

## Setting up
Clone the repository.

Set up the database. You can use a docker container to run the postgres database.
Make a `docker-compose.yml` file as follows
```
version: '3'

services:
  db:
    image: postgres:10
    ports:
      - "5321:5432"
    volumes:
      - ./disa_pgdata:/var/lib/postgresql/data
    container_name: disa_db
```
Start the container with command `docker-compose up -d`

Then create the disa_db with the following one-liner:
`docker exec -u postgres disa_db psql -c "CREATE DATABASE disa_db"`

In both frontend and backend folders, run `npm install` and then `npm start` in separate terminal windows or separate tabs.

In the backend folder, run `node src/database/create_data.js`, after the script prints 'ALL DONE' you need to terminate it with ctrl+c.

Now you should have the project up and running. If not, please blame me.
