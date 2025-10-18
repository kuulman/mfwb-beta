module.exports = {
    async execute(waClient, MessageMedia, message) {
        console.log('[join_leave.js] is running')

        waClient.on('group_join', async (notification) => {
            const { getUserJoinLeaveData } = require("../../api/database")
            const chat = await notification.getChat();
            const jids = notification.recipientIds;
            const mentions = [];
            const mentionTexts = [];

            for (const jid of jids) {
                const userId = jid.split('@')[0];
                mentionTexts.push(`@${userId}`);
                mentions.push(jid);
            }

            console.debug('info')
            console.debug(chat.id._serialized)
            const Plaintext = await getUserJoinLeaveData(chat.id._serialized, 'join');

            if (!Plaintext) {
                console.debug(Plaintext)
                return;
            }

            const text = Plaintext
            .replace(/{user}/g, mentionTexts.join(', '))
            .replace(/{group}/g, chat.name);
            
            console.debug('ok')
            await chat.sendMessage(text, { mentions });
            return
        });

        waClient.on('group_leave', async (notification) => {
            const { getUserJoinLeaveData } = require("../../api/database")
            const chat = await notification.getChat();
            const jids = notification.recipientIds;
            const mentions = [];
            const mentionTexts = [];

            for (const jid of jids) {
                const userId = jid.split('@')[0];
                mentionTexts.push(`@${userId}`);
                mentions.push(jid);
            }
            const Plaintext = await getUserJoinLeaveData(chat.id._serialized, 'leave');

            if (!Plaintext) {
                console.debug(Plaintext)
                return;
            }

            const text = Plaintext
            .replace(/{user}/g, mentionTexts.join(', '))
            .replace(/{group}/g, chat.name);
            
            console.debug('ok')
            await chat.sendMessage(text, { mentions });
            return;
        })
    }
};
