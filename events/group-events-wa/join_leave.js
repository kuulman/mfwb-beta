module.exports = {
    async execute(waClient, MessageMedia, message) {
        console.log('[join_leave.js] is running')

        waClient.on('group_join', async (notification) => {
            const chat = await notification.getChat();
            const jids = notification.recipientIds; 
            const mentions = [];
            const mentionTexts = [];

            for (const jid of jids) {
                const userId = jid.split('@')[0];
                mentionTexts.push(`@${userId}`);
                mentions.push(jid); 
            }

            
            const text = `🎉 Welcome ${mentionTexts.join(', ')} to *${chat.name}!*`;

            await chat.sendMessage(text, {
                mentions
            });
        });

        waClient.on('group_leave', async (notification) => {
            const chat = await notification.getChat();
            const jids = notification.recipientIds; 
            const mentions = [];
            const mentionTexts = [];

            for (const jid of jids) {
                const userId = jid.split('@')[0];
                mentionTexts.push(`@${userId}`);
                mentions.push(jid); 
            }

            const text = `👋 Goodbye ${mentionTexts.join(', ')}`;

            await chat.sendMessage(text, {
                mentions
            });
        })
    }
};
