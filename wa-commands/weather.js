 module.exports = {
    name: 'weather',
    description: 'Menampilkan cuaca',
    usage: '.weather [location]',

    async execute(waClient, message, MessageMedia, dcClient) {
        // Try importing MessageMedia directly
        const { city, getWeather } = require('.././api/weatherAPI.js');
        const location = message.body.slice(9).trim();
        city = location;
        const weatherData = await getWeather(city);
        await message.reply(weatherData);
        console.log('Success execute `.weather` commands, requested by ' + message.from);
    }
} 