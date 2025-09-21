module.exports = {
    name: 'getchat',
    description: 'getchat',
    usage: '.getchat',
    
    async execute(waClient, message) {
        const chat = await message.getChat();
        const contact = await message.getContact();
        if (!(message.from == '6282135368037@c.us') && !(contact.number == '6282135368037')) { // Replace with your number
            await message.reply('This command is only for the bot developer.');
            return;
        }
        if (message.from.endsWith('@g.us')) {
            info = `[DEV TOOLS, CHECK TERMINAL FOR FULL INFO]
Chat ID: ${message.from}
Chat Name: ${chat.name}
Chat Type: ${chat.isGroup ? 'Group' : 'Private'}
Members: ${chat.participants.length}
Unread: ${chat.unreadCount}
Status: ${chat.archived ? 'Archived' : 'Active'}${chat.isMuted ? ' (Muted)' : ''}
Last Message: "${chat.lastMessage.body}" from ${chat.lastMessage.fromMe ? 'Me' : chat.lastMessage.notifyName || 'Contact'}
Message Time: ${chat.lastMessage.timestamp}
Message Status: ${chat.lastMessage.ack === 1 ? 'Sent' : chat.lastMessage.ack === 2 ? 'Delivered' : chat.lastMessage.ack === 3 ? 'Read' : 'Unknown'}
Device: ${chat.lastMessage.deviceType}`;

        } else {
            info = `[DEV TOOLS, CHECK TERMINAL FOR FULL INFO]
Chat ID: ${message.from}
Chat Name: ${chat.name}
Chat Type: ${chat.isGroup ? 'Group' : 'Private'}
Unread: ${chat.unreadCount}
Status: ${chat.archived ? 'Archived' : 'Active'}${chat.isMuted ? ' (Muted)' : ''}
Last Message: "${chat.lastMessage.body}" from ${chat.lastMessage.fromMe ? 'Me' : chat.lastMessage.notifyName || 'Contact'}
Message Time: ${chat.lastMessage.timestamp}
Message Status: ${chat.lastMessage.ack === 1 ? 'Sent' : chat.lastMessage.ack === 2 ? 'Delivered' : chat.lastMessage.ack === 3 ? 'Read' : 'Unknown'}
Device: ${chat.lastMessage.deviceType}`;
        }

        console.log(chat);
        await message.reply(info);
    }
}