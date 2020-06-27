window.onload = ()=> {
	let input = document.getElementById('city');
	input.addEventListener('keydown', e => {
		let name = input.value;
		let data = {
			city:name
		};
		let url = '/find';
		$.ajax({
			url:url,
			data: JSON.stringify(data),
			contentType: 'application/json',
			type:'POST',
			success: function(res, textStatus, xhr) {
				if(xhr.status == 200) {
					let cities = res.cities;
					appendCities(cities);
				}else {
					console.log('Nije dobro');
				}
			},
			dataType: 'json'
		})
	})
}

const appendCities = cities => {
	let div = document.getElementById('search-container');
	let elements = '';
	cities.forEach(city => {
		elements += makeDiv(city)
	})
	div.innerHTML = elements;
	// document.body.appendChild(div);
}

let makeDiv = city => {
	return `
		<div 
			id="${city.id}"
			class="autocomplete-item"
			onclick = appendToInput(this)
		>
			${city.name}
		</div>
	`
}

const appendToInput = el => {
	document.forms['city'].city_id.value = el.getAttribute('id');
}


document.addEventListener('click', e => {
	let searchItems = document.querySelectorAll('.autocomplete-item');
	searchItems.forEach(el => {
		$('.autocomplete-items').children().remove();
	})
})

const checkWeather = el => {
	let id = el.getAttribute('data-id');
	if(id == null)
		return;

	window.location.href = '/byId/' + id;
}

document.addEventListener('keydown', e => {
	console.log(e.keyCode);
	if(e.keyCode == 0xD) 
	{
		e.preventDefault();
		e.stopPropagation();
		let searchItem = document.querySelectorAll('.autocomplete-item')[0];
		let id = searchItem.getAttribute('id');
		if(id == null)
			return;

		window.location.href = '/byId/' + id;
	}
})

const deleteRecord = el => {
	let id = el.getAttribute('data-id');
	if(id == null)
		return;

	window.location.href = '/delete/byId/' + id;
}