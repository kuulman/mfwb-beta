const axios = require('axios');
const express = require('express');
const app = express();
let city = 'Karawang';

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

async function getWeather() {
  try {
    const response = await axios.get('https://api.ryzumi.vip/api/search/weather?city=' + city);
    const data = response.data;
    const cityOutput = data.name;
    const weather = capitalize(data.weather[0].description);
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    console.log(`City: ${cityOutput}\nWeather: ${weather}\nTemperature: ${temp}°C\nHumidity: ${humidity}%\nWind Speed: ${windSpeed} m/s`);
  } catch (error) {
    console.error('Failed to fetch weather data: ' + error.message);
  }
}

app.get('/weatherapi', async (req, res) => {
  try {
    const response = await axios.get('https://api.ryzumi.vip/api/search/weather?city=' + city);
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
    city,
    getWeather,
};
