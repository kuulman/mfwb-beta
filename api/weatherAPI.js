const axios = require('axios');
const express = require('express');
const app = express();
let city = 'Karawang';

  app.get('/weatherapi', async (req, res) => {
    try {
      const response = await axios.get('https://api.ryzumi.vip/api/search/weather?city=' + city);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  app.listen(3500, () => {
    console.log(`weatherAPI is running on port 3500/weatherapi`);
  });

module.exports = {

};
