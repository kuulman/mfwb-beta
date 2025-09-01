module.exports = {
    name: 'egg_stock',
    description: 'Menampilkan egg stock',
    usage: '.egg_stock',
    
    async execute(waClient, message, MessageMedia, dcClient) {
        // Try importing MessageMedia directly
        const { getEggOutput } = require('../../Grow a Garden/api.js')
        const axios = require("axios")
        await message.reply(getEggOutput())
        console.log('Success execute `.egg_stock` commands, requested by ' + message.from);
    }
} 