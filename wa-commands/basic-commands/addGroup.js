const { get } = require('pm2');

 module.exports = {
    name: 'addgroup',
    description: 'Add group',
    usage: '.addgroup',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { regGroup } = require('../../api/database');
        const chat = await message.getChat()
        const contact = await message.getContact()
        
        if (!chat.isGroup) {
            await message.reply("This features can be used on group chat!")
            return
        }

        const data = await regGroup(contact.id._serialized, chat.id._serialized)
        if (data == false) { await message.reply("You need to create account before using this feature")}
        await message.reply(`Registered this group to ${('+' + contact.number)} / ${contact.pushname}'s account`)
        return
    },
} 