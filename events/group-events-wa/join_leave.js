module.exports = {
    async execute(waClient, MessageMedia, message) {
        console.log('[join_leave.js] is running')

        waClient.on('group_join', async (notification) => {
            const { getUserJoinLeaveData } = require("../../api/database").default
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

            const Plaintext = await getUserJoinLeaveData(chat.id._serialized);

            if (!Plaintext) {
                console.debug("e")
                return;
            }

            const groupData = Plaintext.group_reg.find(
                (g) => g.id === chat.id._serialized
            );
            
            const joinMessage = groupData?.settings?.join_leave?.join_message;
            console.debug(joinMessage)


            const text = joinMessage
                .replace(/{user}/g, mentionTexts.join(', '))
                .replace(/{group}/g, chat.name);

            await chat.sendMessage(text, { mentions });
            return
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
            return
        })
    }
};
