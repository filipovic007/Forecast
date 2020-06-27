# Forecast
Weather app in NodeJS, simple clean with one API.
Just enter name of city and see current temperature.

### Installation
* position in root of project and then run `npm install`
* Copy `.env.example` file as `.env` -- comand `cp .env.example .env`
* In `.env` file in root of project type your db_host, db_port, password, api_key, db_name
* in mysql create database as you configure in `.env` file
* run `node database/migrate.js`
* run app by command `npm start`
