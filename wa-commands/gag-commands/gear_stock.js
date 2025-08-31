module.exports = {
    name: 'egg_stock',
    description: 'Menampilkan egg stock',
    usage: '.egg_stock',
    
    async execute(waClient, message, MessageMedia, dcClient) {
        // Try importing MessageMedia directly
        const { getGearOutput } = require('../../Grow a Garden/api.js')
        await message.reply(getGearOutput())
        console.log('Success execute `.gear_stock` commands, requested by ' + message.from);
    }
} 