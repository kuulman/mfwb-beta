module.exports = {
    name: 'hw',
    description: 'Menampilkan cuaca',
    usage: '.hw [date] [rsn]',

    async execute(waClient, message, MessageMedia, dcClient) {
    const { uploadImage } = require('../../api/mediaDB')
    const { findEventForHW, createHW } = require('../../api/database')
        const chat = await message.getChat();
        const contact = await message.getContact()
        const fulltext = message.body.slice(3).trim();
        const args = fulltext.split(' ');
        let attempts = 0;
        let date = args[0];
        let reason = args.slice(1).join(' ');
        
        function isValidDate(input) {
            // Cek pola dasar dd/mm/yyyy
            const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
            const match = input.match(regex);
            if (!match) return false;

            const day = parseInt(match[1], 10);
            const month = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);

            // Cek range bulan
            if (month < 1 || month > 12) return false;

            // Hitung jumlah hari di bulan
            const daysInMonth = new Date(year, month, 0).getDate();
            if (day < 1 || day > daysInMonth) return false;

            return true;
        }
        if (!isValidDate(date)) {
            await message.reply('Invalid date format. Use DD/MM/YYYY (ex: 06/10.2025)')
            return
        }
    
        if (message.from.endsWith('@g.us')) {
            const participant = chat.participants
                .filter(p => p.id._serialized.endsWith('@c.us'))
                .map(p => ({
                    id: p.id._serialized,
                    isAdmin: p.isAdmin,
                    isSuperAdmin: p.isSuperAdmin
                }));

            const contactID = contact.id._serialized

            let senderParticipant = (participant.find(p => p.id === contactID));

            // Fixed: Check senderParticipant instead of participant array
            if (!senderParticipant || (!senderParticipant.isAdmin && !senderParticipant.isSuperAdmin)) {
                console.log('Access denied for:', message.author);
                return await message.reply("You are not group admin!");
            }
        }

        const find = await findEventForHW(message.from)
        if (!find || find.length === 0) {
            await message.reply('You have to register an event before using this feature!')
            return
        }
        const nameEvent = find.map(item => `${item.name} (${item.type})`).join('\n- ')
        await message.reply(`Select event that want to use: \n\n- ${nameEvent} \n\nType the one of event name above to continue. Type cancel to abort`)

        const interactiveChat = async (msg) => {
            const userInput = msg.body.trim();
            const selected = find.find(item => item.name.toLowerCase() === userInput.toLowerCase());

            if (userInput == 'Cancel') {
                await msg.reply('Process Canceled')
                waClient.off('message', interactiveChat)
                return
            }
            if (!selected) {
                attempts++
                if (attempts >= 3) {
                    await msg.reply("❌ Too many invalid attempts. Cancelling");
                    waClient.off('message', interactiveChat)
                    return
                }
                await msg.reply("❌ Event not found. Please type one of the names exactly as shown.");
                return;
            }

            // Upload image to supabase and get the image URL
            let urlResult;
            if (message.hasMedia) {
                const media = await message.downloadMedia()
                const buffer = Buffer.from(media.data, 'base64');
                const ext = media.mimetype.split('/')[1];
                const fileName = `file_${Date.now()}.${ext}`;
                urlResult = await uploadImage(fileName, buffer, media.mimetype)
            }

            let [datePart, timePart] = selected.time.split('T')
            datePart = `${date}T${timePart}`
            await createHW(message.from, selected.name, urlResult, reason, datePart)
            await msg.reply(`✅ Homework added to: ${selected.name}. Homework will be sent with event`);
            waClient.off('message', interactiveChat)
        };
        waClient.on('message', interactiveChat)
    }
}