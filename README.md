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

In folders frontend, backend and kurki, run `npm install` in separate terminal windows or separate tabs.

In the backend folder, create a file called `.env` and add there these lines 
```
DB_URL=postgres://postgres@localhost:5321/disa_db
KURKI_URL=http://localhost:3002
SECRET=<your own personal super secret>
NODE_ENV=development
```

Create a `.env` also in the kurki-folder, but only add the database url there: `DB_URL=postgres://postgres@localhost:5321/disa_db`

In the backend folder, run `node src/database/create_data.js`.

Now just run `npm start` in separate terminal windows or separate tabs in each folder: frontend, backend and kurki. The kurki-app is used just to validate logins. You can log in as any user in the database by simply entering the user-id as the username and `password` ase the password.

Now you should have the project up and running. If not, please blame me.

## Running tests

Add the following line to .env: `TEST_DB_URL=postgres://postgres@localhost:5321/disa_test_db`

Create the test database like you created the mian database:
`docker exec -u postgres disa_db psql -c "CREATE DATABASE disa_test_db"`

Now you can run `npm test` in backend and frontend to run their respective tests.
