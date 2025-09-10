module.exports = {
    name: 'hp',
    description: 'Menampilkan cuaca',
    usage: '.hp [location]',

    async execute(waClient, message, MessageMedia, dcClient) {
        const chat = await message.getChat();
        const contact = await message.getContact();
        const replyMsg = await message.getQuotedMessage()
        let text = message.body.slice(4).trim();

        if (message.hasQuotedMsg) {
            text = replyMsg.body
        }

        if (!chat.IsGroup) {
            console.log('Access denied for', message.from)
            message.reply("You only can use this command in group chat!")
            return
        }

        const participant = chat.participants
            .filter(p => p.id._serialized.endsWith('@c.us'))
            .map(p => ({
                id: p.id._serialized,
                isAdmin: p.isAdmin,
                isSuperAdmin: p.isSuperAdmin
            }));
        
        const contactID = contact.id._serialized

        let senderParticipant = (participant.find(p => p.id === contactID));
        
        console.log('senderParticipant:', senderParticipant); 
        console.log('message.from (group ID):', message.from);
        
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
                console.log('Null object requested by:', senderParticipant)
                return
            }
            if (message.hasMedia || replyMsg.hasMedia) {
                const media = await message.downloadMedia() || await replyMsg.downloadMedia();
                await chat.sendMessage(media, { caption: text, mentions });
                console.log('Success execute `.hp` command with media, requested by', senderParticipant);
            } else {
                await chat.sendMessage(text, { mentions });
                console.log('Success execute `.hp` command, requested by', senderParticipant);
            }
        } catch (error) {
            console.error('Error executing hp command:', error);
            await message.reply('An error occurred while executing the command.');
        }
    },
}