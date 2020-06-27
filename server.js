const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const env = require('dotenv').config().parsed;
const path = require('path');



const app = express()

const migration = require('./database/history');
const historyModel = require('./model/history');
const City = require('./model/city');

const conn = require('./database/connection');

// const apiKey = '2f5292a4bf842dfc531214fadaeffe04';
const apiKey = env.API_KEY;

app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs')

app.get('/', async function (req, res) {
  let cities = await historyModel.all();
  res.render('index', {weather: null, error: null, history:cities});
})

app.post('/', function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

  request(url, async function (err, response, body) {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        console.log(weather.name);
        historyModel.storeOrUpdate(weather);
        console.log(weather);
        let weatherText = `Sada je ${weather.main.temp}°C u ${weather.name}-u!`;
        let cities = await historyModel.all();
        res.render('index', {weather: weatherText, error: null, history: cities});
      }
    }
  });
})

app.post('/byId', function (req,res) {
  let city_id = req.body.city_id;
  let apiKey = env.API_KEY;
  let url = `http://api.openweathermap.org/data/2.5/weather?id=${city_id}&appid=${apiKey}`;
  let data = request(url, async(err,response,body) => {
    console.log(response);
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', history:null});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again',history:null});
      } else {
        historyModel.storeOrUpdate(weather);
        let temp = parseFloat(weather.main.temp) - 273.15;
        let weatherText = `Sada je ${temp.toFixed(2)}°C u ${weather.name}-u!`;
        let cities = await historyModel.all();
        res.render('index', {weather: weatherText, error: null, history: cities});
      }
    }
  });
})

app.get('/byId/:id', function (req,res) {
  let city_id = req.params.id;
  let apiKey = env.API_KEY;
  let url = `http://api.openweathermap.org/data/2.5/weather?id=${city_id}&appid=${apiKey}`;
  let data = request(url, async(err,response,body) => {
    if(err){
      res.render('index', {weather: null, error: 'Error, please try again', history:null});
    } else {
      let weather = JSON.parse(body)
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again',history:null});
      } else {
        historyModel.storeOrUpdate(weather);
        let temp = parseFloat(weather.main.temp) - 273.15;
        let weatherText = `Sada je ${temp.toFixed(2)}°C u ${weather.name}-u!`;
        let cities = await historyModel.all();
        res.render('index', {weather: weatherText, error: null, history: cities});
      }
    }
  });
})

app.post('/find', async(req,res) => {
  if(!req.body || !('city' in req.body)){
    res.statusCode = 422;
    res.end(JSON.stringify({message:'cannot process'}));
  }
  let cities = await City.findByNameApi(req.body.city);
  res.statusCode = 200;
  res.end(JSON.stringify({cities:cities}));
})

app.get('/delete/byId/:id', async(req,res) => {
  let id = req.params.id;
  
  if(id == null)
    res.redirect('/');

  await historyModel.deleteById(id);
  res.redirect('/');
})

app.listen(3000, function () {
  console.log('Aplikacija slusa na portu: 3000!')
})
