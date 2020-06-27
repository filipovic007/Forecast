const fs = require('fs');
const conn = require('./connection');
const cities = {
	seed: () => {
		return new Promise((resolve,reject) => {
			let stream = fs.createReadStream('./database/city.list.json');
			let data = '';
			stream.on('data', function(chunk) {
				data += chunk;
			})
			stream.on('end', function() {
				let fields = JSON.parse(data);
				let query = `
					INSERT INTO cities
						(id,name,country,state,lng,lat)
					VALUES (?,?,?,?,?,?)
				`;
				let n = 0;
				fields.forEach(row => {
					let rowdata = {
						city_id: row.id,
						name: row.name,
						country: row.country,
						state: row.state,
						lng: row.coord.lon,
						lat: row.coord.lat
					}
					let idata = [rowdata.city_id, rowdata.name, rowdata.country, rowdata.state, rowdata.lng, rowdata.lat];
					conn.query(query, idata, (err, success) => {
						if(err) {
							console.log(err);
							throw new Error('Neuspesno seed-ovanje gradova');
						}
					})
				})
				console.log('Uspesno seed-ovanje gradova');
			})

		})
	}
}

module.exports = cities;