# disa-tool

DISA-tool is a web application designed to help the usage of digital self-assessment forms.

## Setting up

Clone the repository.

Set up the database in a docker container.
Make a `docker-compose.yml` file as follows:

```
version: '3'

services:
  db:
    image: postgres:10
    ports:
      - '5321:5432'
    environment:
      - POSTGRES_USER=disa
      - POSTGRES_PASSWORD=dev
      - POSTGRES_DB=disa_db
    volumes:
      - ./disa_pgdata:/var/lib/postgresql/data
    container_name: disa_db
```

Start the container with command `docker-compose up -d`

In folders frontend, backend and kurki, run `npm install` in separate terminal windows or separate tabs.

In the backend folder, create a file called `.env` and add there these lines

```
DB_NAME=disa_db
DB_USER=disa
DB_PASS=dev
DB_HOST=localhost
DB_PORT=5321
KURKI_URL=http://localhost:3002
SECRET=<your own personal super secret>
NODE_ENV=development
TEST_DB_NAME=disa_test_db
```

Create a `.env` also in the kurki-folder, but only add the database parameters there:

```
DB_NAME=disa_db
DB_USER=disa
DB_PASS=dev
DB_HOST=localhost
DB_PORT=5321
```

Create the database with the following one-liner (make sure the docker container is running):
`docker exec disa_db psql -U postgres -c "CREATE DATABASE disa_db"` or try `docker exec disa_db psql --username=disa --dbname=disa_db -c "CREATE DATABASE disa_db"`

In the backend folder, run `node src/database/create_data.js` - *try it multiple times if it fails*!. You can also use a database dump. If you use a dump, run the anonymiser script with `node src/database/anonymise_data.js`.

To run all migrations type `npm run db:migrate` in the backend folder. You can roll back the most recent migration with command `npm run db:rollback`. _If you create a new migration, remember to run the migration command also on the staging and production servers. There is no automation to run these!_

Now just run `npm start` in separate terminal windows or separate tabs in folders: frontend and kurki, and `npm run start-dev` in the backend folder. The kurki-app is used for mocking logins. You can log in as any user in the database by simply entering the user-id as the username and `password` as the password.

Now you should have the project up and running.

## Running tests

### Frontend

Frontend tests should work without further configuration. Simply run `npm test`.

### Backend

Then create the test DB in /backend: `NODE_ENV=test npx sequelize-cli db:create --config conf-backend.js`

Now you can run `npm test` to run backend tests.
