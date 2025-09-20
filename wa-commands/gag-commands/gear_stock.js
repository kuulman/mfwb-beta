module.exports = {
    name: 'gear_stock',
    description: 'Menampilkan gear stock',
    usage: '.gear_stock',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { getGearOutput } = require('../../api/GAGapi.js')
        await message.reply(getGearOutput())
        console.log('Success execute `.gear_stock` commands, requested by ' + message.from);
    }
} 