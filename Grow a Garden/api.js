const axios = require('axios');
const express = require('express');
const app = express();

  let lastData = null;
  let weatherOutput = null;
  let gearOutput = null;
  let seedOutput = null;
  let eggOutput = null;

  let lastWeatherOutput = null;
  let lastGearOutput = null;
  let lastSeedOutput = null;
  let lastEggOutput = null;
  
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  async function UpdateData() {
    try {
      const response = await axios.get('https://gagapi.onrender.com/alldata');
      const currentData = response.data;

      if (JSON.stringify(currentData) === JSON.stringify(lastData)) return;
      lastData = currentData;
      console.log(`[api.js] API Data Refreshed: ${new Date().toLocaleString()}`);

      // Weather
      const weatherType = capitalize(currentData.weather.type);
      const weatherDesc = currentData.weather.effects[0];
      weatherOutput = currentData.weather.active
        ? `🌤️ Weather: ${weatherType} \n- ${weatherDesc}`
        : null;

      if (weatherOutput !== lastWeatherOutput) {
        // await waClient.sendMessage('120363401271520921@g.us', weatherOutput);
        lastWeatherOutput = weatherOutput;
      }

      // Gear
      const gear = currentData.gear.map(item => `${item.name} (${item.quantity}x)`).join('\n- ');
      gearOutput = `🎒 Gear Stock: \n- ${gear}`;

      // Seeds
      const seed = currentData.seeds.map(item => `${item.name} (${item.quantity}x)`).join('\n- ');
      seedOutput = `🍅 Seeds Stock: \n- ${seed}`;

      if (gearOutput !== lastGearOutput || seedOutput !== lastSeedOutput) {
       // await waClient.sendMessage('120363401271520921@g.us', `${seedOutput}\n\n${gearOutput}`);
        lastGearOutput = gearOutput;
        lastSeedOutput = seedOutput;
      }

      // Eggs
      const egg = currentData.eggs.map(item => `${item.name} (${item.quantity}x)`).join('\n- ');
      eggOutput = `🥚 Eggs Stock: \n- ${egg}`;

      if (eggOutput !== lastEggOutput) {
       // await waClient.sendMessage('120363401271520921@g.us', eggOutput);
        lastEggOutput = eggOutput;
      }

    } catch (error) {
      console.error('[api.js] Error fetching data:', error.message);
    }
  }

  app.get('/gagstock', async (req, res) => {
    try {
      const response = await axios.get('https://gagapi.onrender.com/alldata');
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

function runAPI() {
  UpdateData();

}

module.exports = {
  UpdateData,
  getWeatherOutput: () => weatherOutput,
  getSeedOutput: () => seedOutput,
  getEggOutput: () => eggOutput,
  getGearOutput: () => gearOutput,
  runAPI,
  app
};
