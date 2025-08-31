module.exports = {
    name: 'seed_stock',
    description: 'Menampilkan stok seed GAG',
    usage: '.seed_stock',
    
    async execute(waClient, message, MessageMedia, dcClient) {
        // Try importing MessageMedia directly
        const { getSeedOutput } = require('../../Grow a Garden/api.js')
        const axios = require("axios")
        await message.reply(getSeedOutput())
        console.log('Success execute `.seed_stock` commands, requested by ' + message.from);
    }
}