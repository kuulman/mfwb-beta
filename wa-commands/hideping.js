 module.exports = {
    name: 'hp',
    description: 'Menampilkan cuaca',
    usage: '.hp [location]',

    async execute(waClient, message, MessageMedia, dcClient) {
        let text = message.body.slice(4).trim();
        const chat = await message.getChat();
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
        }

        await chat.sendMessage(text, { mentions });
    },
} 