const conn = require('../database/connection');
const City = require('./city');
const sqlstring = require('sqlstring');
const fs = require('fs'); 
const History = {
	all: () => {
		return new Promise((res,rej) => {
			let query = `
				SELECT 
					cities.*,
					history.id as history_id,
					history.last_temperature,
					history.viewed_at
				FROM history
				JOIN cities
				ON cities.id = history.city_id;
			`;
			conn.query(query, (err,data) => {
				if(err) {
					rej(err);
				}else res(data);
			})
		});
	},
	storeOrUpdate: weather => {
		return new Promise(async(res,rej) => {
			let data = {
				name: weather.name,
				last_temperature: weather.main.temp,
				viewed_at: new Date()
			}
			let query = `
				SELECT cities.id
				FROM cities
				WHERE name LIKE ?
			`;
			let city_name = '%' + data.name + '%';
			let city = await City.findByName(city_name);
			if(!city)
				res(false);

			if(city && city != [] && city.length != 0)
			{
					if(city && city[0] && city[0].id)
						city = city[0].id;
					let history_exists = await History.findByCityId(city);
					console.log(typeof history_exists);
					console.log(history_exists);
					if(!history_exists || (Object.keys(history_exists).length == 0))
					{
						query = `
							INSERT INTO history
								(city_id, last_temperature, viewed_at)
							VALUES
								(${city}, ${data.last_temperature}, NOW())
						`;
						conn.query(query, (err, success) => {
							if(err)
								rej(err);
							else res(success);
						})
					}else {
						query = `
							UPDATE history
							SET last_temperature = ?
							WHERE city_id = ?
						`;
						conn.query(query, [data.last_temperature, city], (err,result) => {
							if(err)
								rej(err);
							else res(result);
						})
					}
			}else {
				rej('city does not exists');
			}
		})
	},
	findByCityId: city_id => {
		return new Promise((res,rej) => {
			let query = `
				SELECT *
				FROM history
				WHERE city_id = ?
			`;
			conn.query(query, [city_id], (err,result) => {
				if(err)
					rej(err);
				else res(result);
			})
		})
	},
	deleteById: id => {
		console.log(id);
		return new Promise((res,rej) => {
			let query = `
				DELETE
				FROM history
				WHERE city_id = ?
			`;
			console.log(query);
			conn.query(query, [id], (err,result) => {
				if(err)
					rej(err);
				else res(result);
			})
		})
	}  
}

module.exports = History;