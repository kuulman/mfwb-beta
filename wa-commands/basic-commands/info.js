module.exports = {
    name: 'info',
    description: 'Menampilkan informasi bot',
    usage: '.info',
    
    async execute(waClient, message, MessageMedia, dcClient) {
        // Try importing MessageMedia directly
        try {
            const { MessageMedia: DirectMessageMedia } = require('whatsapp-web.js');
            console.log('Direct import MessageMedia:', typeof DirectMessageMedia);
            console.log('Direct fromFilePath:', typeof DirectMessageMedia?.fromFilePath);

            if (DirectMessageMedia && typeof DirectMessageMedia.fromFilePath === 'function') {
                const chat = await message.getChat();
                const media = DirectMessageMedia.fromFilePath('./Thumbnail.png');
                
                const infoMessage = `*_Codename: MFWB_*
_Version: 1620dp (Developer Preview)_

Changes:
- Rewrite Bot Code
- Optimizing Bot Response
- Changes All Bot Triggers

© Copyright InfoGAG. All right reserved.`;

                await waClient.sendMessage(chat.id._serialized, media, { caption: infoMessage });
                console.log('Success execute `.info` commands, requested by ' + message.from);
                return;
            }
        } catch (directImportError) {
            console.error('Direct import failed:', directImportError);
        }
    }
}