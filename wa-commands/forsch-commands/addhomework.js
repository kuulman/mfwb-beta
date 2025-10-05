const { findEventForHW } = require('../../database');

module.exports = {
    name: 'hw',
    description: 'Menampilkan cuaca',
    usage: '.hw [date] [rsn]',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { uploadImage } = require('../../mediaDB')
        const { findEventForHW } = require('../../database')
        const chat = await message.getChat();
        const fulltext = message.body.slice(3).trim();
        const args = fulltext.split(' ');
        let attempts = 0;
        let date = args[0];
        let reason = args.slice(1).join(' ');

        const [day, month, year] = date.split("/");
        let dateObj = new Date(year, month - 1, day);
        dateObj.setDate(dateObj.getDate() + 1);
        const invertedDateForSupabase = dateObj.toISOString().slice(0, 10).replace(/-/g, "/");
        console.log(invertedDateForSupabase)

        const find = await findEventForHW(message.from)
        if (!find || find.length === 0) {
            await message.reply('You have to register an event before using this feature!')
            return
        }
        const nameEvent = find.map(item => `${item.name} (${item.type})`).join('\n- ')
        await message.reply(`Select event that want to use: \n\n- ${nameEvent} \n\nType the one of event name above to continue. Type cancel to abort`)

        const interactiveChat = async (message) => {
            const userInput = message.body.trim();
            const selected = find.find(item => item.name.toLowerCase() === userInput.toLowerCase());

            if (userInput == 'Cancel') {
                await message.reply('Process Canceled')
                waClient.off('message', interactiveChat)
            }
            if (!selected) {
                attempts++
                if (attempts >= 3) {
                    await message.reply("❌ Too many invalid attempts. Cancelling");
                    waClient.off('message', interactiveChat)
                }
                await message.reply("❌ Event not found. Please type one of the names exactly as shown.");
                return;
            }

            // Upload image to supabase and get the image URL
            if (message.hasMedia) {
                const media = await message.downloadMedia()
                const buffer = Buffer.from(media.data, 'base64');
                const ext = media.mimetype.split('/')[1];
                const fileName = `file_${Date.now()}.${ext}`;
                uploadImage(fileName, buffer, reason, media.mimetype)
            }

            await message.reply(`✅ Homework added to: ${selected.name}`);
            waClient.off('message', interactiveChat)
        };
        waClient.on('message', interactiveChat)
    }
}