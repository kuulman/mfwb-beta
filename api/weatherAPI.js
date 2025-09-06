const axios = require('axios');
const express = require('express');
const { getWeatherOutput } = require('../Grow a Garden/api');
const { error } = require('qrcode-terminal');
const app = express();
let defaultCity = 'Jakarta'
let weatherDataOutput;

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

async function getWeather(city = null) {
  try {
    let targetCity = city

    if (!targetCity || targetCity.trim() == '') {
      targetCity = defaultCity
    }

    console.log(`Fetching data for ${targetCity} city`)
    const response = await axios.get(`https://api.ryzumi.vip/api/search/weather?city=${encodeURIComponent(targetCity)}`);
    const data = response.data;
    const cityOutput = data.name;
    const weather = capitalize(data.weather[0].description);
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const country = data.sys.country;
    const loclon = data.coord.lon 
    const loclat = data.coord.lat

    console.log(`Location: ${cityOutput}\nWeather: ${weather}\nTemperature: ${temp}°C\nHumidity: ${humidity}%\nWind Speed: ${windSpeed} m/s\nCountry: ${country} \nLocation: ${loclat}, ${loclon}`);
    weatherDataOutput = `Location: ${cityOutput}\nWeather: ${weather}\nTemperature: ${temp}°C\nHumidity: ${humidity}%\nWind Speed: ${windSpeed} m/s\nCountry: ${country} \nLocation: ${loclat}, ${loclon}`
  } catch (error) {
    weatherDataOutput = '❌ Invalid Location Requested'
    console.error('Failed to fetch weather data: ' + error.message);
  }
}

function setCity(newCity) {
  if (newCity && newCity.trim() != '') {
    defaultCity = newCity.trim()
  } else {
    console.error('Invalid city name provided to SetCity')
  }
}

app.get('/weatherapi', async (req, res) => {
  try {
    const requestedCity  = req.query.city || defaultCity;
    if (typeof requestedCity !== String || requestedCity.trim().length === 0) {
      return res.status(400).json({error: 'Invalid Paramater'})
    }
    const encodedCity = encodeURIComponent(requestedCity)
    const response = await axios.get(`https://api.ryzumi.vip/api/search/weather?city=${encodedCity}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data: ' + error.message });
  }
});

app.listen(3500, () => {
  console.log(`weatherAPI is running on port 3500/weatherapi`);
  getWeather()
});

module.exports = {
    setCity,
    getWeather,
    defaultCity,
    getWeatherOutput: () => weatherDataOutput
};
