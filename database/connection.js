const mysql = require('mysql');
const dotenv = require('dotenv');

const config = dotenv.config().parsed;
let conn = {
	host: config.DB_HOST,
	port: config.DB_PORT,
	user: config.DB_USER,
	password: config.DB_PASS,
	database: config.DB_DATABASE
}
var connection = mysql.createConnection(conn);

module.exports = connection;