module.exports = {
    name: 'getchat',
    description: 'getchat',
    usage: '.getchat',
    
    async execute(waClient, message) {
        const chat = await message.getChat();
        console.log(contact)
        if (!(message.from == '6282135368037@c.us') && !(contact.number == '6282135368037')) { // Replace with your number
            await message.reply('This command is only for the bot developer.');
            return;
        }
        if (message.from.endsWith('@g.us')) {
            info = `[DEV TOOLS, CHECK TERMINAL FOR FULL INFO] \nChat ID: ${message.from}\nChat Name: ${chat.name}\nChat Participants: ${chat.participants.length}`;
        } else {
            info = `[DEV TOOLS, CHECK TERMINAL FOR FULL INFO] \nChat ID: ${message.from}\nChat Name: ${chat.name}`
        }
        console.log(chat);
        await message.reply(info);
    }
}