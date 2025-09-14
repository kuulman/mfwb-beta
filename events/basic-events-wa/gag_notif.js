const { UpdateData, getWeatherOutput, getEggOutput, getGearOutput, getSeedOutput, app: API_app, runAPI} = require('../../api/GAGapi.js')

module.exports = {

    async execute(waClient, message) {
        let lastWeather = null
        let lastSeed = null
        let lastEgg = null
        let lastGear = null
        
        async function SendNotif() {
            try {
                // Weather
                if (lastWeather !== getWeatherOutput()) {
                    lastWeather = getWeatherOutput();
                    console.log('Weather Updated Successfully');
                    await waClient.sendMessage('120363401271520921@g.us', lastWeather);
                } 
                // Seed and Gear
                if (lastSeed !== getSeedOutput() && lastGear !== getGearOutput()) {
                    lastSeed = getSeedOutput();
                    lastGear = getGearOutput();
                    console.log('Seed and Gear Stock Updated Successfully');
                    await waClient.sendMessage('120363401271520921@g.us', lastSeed + '\n\n' + lastGear);
                }
        
                // Eggs
                if (lastEgg !== getEggOutput()) {
                    lastEgg = getEggOutput();
                    console.log('Egg Stock Updated Successfully');
                    await waClient.sendMessage('120363401271520921@g.us', lastEgg);
                }
            } catch (err) {
                console.error('[gag_notif] Cannot send notification due to error: ' + err);
            }
        }
        setInterval(() => {
            runAPI()
            SendNotif()
        } ,15000)
}
}