module.exports = {
    name: 'seed_stock',
    description: 'Menampilkan seed stock',
    usage: '.seed_stock',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { getSeedOutput } = require('../../api/GAGapi.js')
        const axios = require("axios")
        await message.reply(getSeedOutput())
        console.log('Success execute `.seed_stock` commands, requested by ' + message.from);
    }
} 