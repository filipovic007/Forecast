const mysql = require('mysql');
const conn = require('../database/connection')
const Cities = {
	findById: id => {
		return new Promise((res,rej) => {
			let query = `
				SELECT *
				FROM cities
				WHERE id = ?
			`;
			conn.query(query, [id], (err,field, columns) => {
				if(err)
					throw new Error(err);
				else res(field);
			})
		})
	},
	findByName: name => {
		return new Promise((res,rej) => {
			let query = `
				SELECT cities.id
				FROM cities
				WHERE name LIKE ?
			`;
			conn.query(query, [name], (err, result, fields)=> {
				if(err)
					throw new Error(err);
				else res(result);
			})
		})
	},
	findByNameApi: name => {
		return new Promise((res,rej) => {
			let query = `
				SELECT *
				FROM cities
				WHERE name LIKE ?
				LIMIT 15
			`;
			let city_name = name + '%';
			conn.query(query, [city_name], (err, result, fields)=> {
				if(err)
					throw new Error(err);
				else res(result);
			})
		})
	}
}

module.exports = Cities;