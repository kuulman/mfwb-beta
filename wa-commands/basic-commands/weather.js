 module.exports = {
    name: 'weather',
    description: 'Menampilkan cuaca',
    usage: '.weather [location]',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { setCity, getWeather, getWeatherOutput } = require('.././api/weatherAPI.js');
        const location = message.body.slice(9).trim();
        if (!location) {
            await message.reply("You need to fill the city name!")
            return
        }

        setCity(location);
        await getWeather(location);
        const weatherData = getWeatherOutput()
        await message.reply(weatherData);
        console.log('Success execute `.weather` commands, requested by ' + message.from);
    },
} 