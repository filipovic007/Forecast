const conn = require('./connection');
const cities = require('./cities');
const Migration = {
	migrate: async function() {
		conn.connect();
		let query = "CREATE DATABASE IF NOT EXISTS forecast";
		conn.query(query, async (err,res) => {
			if(err) {
				console.log(err);
				throw new Error('Nije moguce kreirati bazu');
			}

			await conn.query('USE forecast;');

			let query = `
			CREATE TABLE IF NOT EXISTS history (
				id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
				city_id INT NOT NULL,
				last_temperature VARCHAR(50),
				viewed_at TIMESTAMP
			);
			`;
			await conn.query(query, (err,res) => {
				if(err) {
					console.log(err);
					throw new Error('Nije moguce kreirati tabelu history');
				}
			})

			query = `
				CREATE TABLE IF NOT EXISTS cities (
					id INT NOT NULL PRIMARY KEY,
					name VARCHAR(100),
					country VARCHAR(100),
					state VARCHAR(100),
					lng DECIMAL(11,7),
					lat DECIMAL(11,7)
				);
			`;
			await conn.query(query, (err,res) => {
				if(err)
					throw new Error('Nije moguce kreirati tabelu cities');
			})

			try{
				// await conn.query("ALTER TABLE history DROP FOREIGN KEY city_fk", (err,res) => {
				// 	if(err)
				// 		throw new Error(err);
				// });
			}catch(e) {

			}

			query = `
				ALTER TABLE history
				ADD CONSTRAINT city_fk
				FOREIGN KEY(city_id)
				REFERENCES cities(id)
				ON UPDATE cascade
				ON DELETE cascade
			`;
			await conn.query(query, (err,res) => {
				if(err)
					throw new Error(err);
			})

			await cities.seed();

			query = `
				ALTER TABLE cities
				ADD INDEX city_name_index (name)
			`;
			await conn.query(query, (err,res) => {
				if(err)
					throw new Error(err);
			})
		})
	}
}

module.exports = Migration;