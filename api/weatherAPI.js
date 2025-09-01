const axios = require('axios');
const express = require('express');
const app = express();
let city = 'Karawang';

async function getWeather(city) {
  try {
    const response = await axios.get('https://api.ryzumi.vip/api/search/weather?city=' + city);
    const data = response.data;
    const cityOutput = data.name
  } catch (error) {
    throw new Error('Failed to fetch weather data: ' + error.message);
  }
}

app.get('/weatherapi', async (req, res) => {
  try {
    const response = await getWeather(city);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(3500, () => {
  console.log(`weatherAPI is running on port 3500/weatherapi`);
});

module.exports = {
    city,
    getWeather,
};
