module.exports = {
    name: 'hp',
    description: 'Menampilkan cuaca',
    usage: '.hp [location]',

    async execute(waClient, message, MessageMedia, dcClient) {
        let messageID;
        let text = message.body.slice(4).trim();
        const chat = await message.getChat();
        const contact = await message.getContact();
        // Debug logs
        console.log('message.from (group ID):', message.from);
        console.log('message.author (sender ID):', message.author);

        
        // Get all participants with @c.us (individual users)
        const participant = chat.participants
            .filter(p => p.id._serialized.endsWith('@c.us'))
            .map(p => ({
                id: p.id._serialized,
                isAdmin: p.isAdmin,
                isSuperAdmin: p.isSuperAdmin
            }));
        
        const contactID = contact.id._serialized

        // Try multiple ways to find sender
        let senderParticipant = (participant.find(p => p.id === contactID));
        
        console.log('senderParticipant:', senderParticipant);
        console.log('all participants:', participant.map(p => p.id));
        
        // Fixed: Check senderParticipant instead of participant array
        if (!senderParticipant || (!senderParticipant.isAdmin && !senderParticipant.isSuperAdmin)) {
            console.log('Access denied for:', message.author);
            return await message.reply("You are not group admin!");
        }

        // Create mentions array - fixed the format
        let mentions = [];
        for (let p of chat.participants) {
            if (p.id._serialized.endsWith('@c.us')) {
                mentions.push(p.id._serialized);
            }
        }

        try {
            if (!text && !message.hasMedia) {
                message.reply("Text cannot be null")
                console.log('Null object requested by:' + senderParticipant)
            }
            if (message.hasMedia) {
                const media = await message.downloadMedia();
                await chat.sendMessage(media, { caption: text, mentions });
                console.log('Success execute `.hp` command with media, requested by ' + message.from);
            } else {
                await chat.sendMessage(text, { mentions });
                console.log('Success execute `.hp` command, requested by ' + message.from);
            }
        } catch (error) {
            console.error('Error executing hp command:', error);
            await message.reply('An error occurred while executing the command.');
        }
    },
}