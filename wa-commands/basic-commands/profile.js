const { get } = require('pm2');

 module.exports = {
    name: 'profile',
    description: 'Check user profile in the database',
    usage: '.profile',

    async execute(waClient, message, MessageMedia, dcClient) {
        const { UserAccInput, checkUser } = require('../../database');
        const chat = message.getChat()
        let Unum = message.from
        let FEnum = '+' + message.from.replace('@c.us', '')

        if (chat.isGroup) {
            await message.reply('This command only works in personal chat')
            return
        }
        UserAccInput('', '', Unum);
        const result = await checkUser(Unum);
        if (!result || result.length === 0 || result[0]['active'] === false) {
            await message.reply('You dont have account in this number! register with `.cu [email] [password] command`');        
            console.log('[Database] No account found for number:', Unum);
            return;
        } else {
            await message.reply(`${FEnum} Registered Account\n\nEmail: ` + result[0]['email'] + `\nType Account: ` + result[0]['type_acc'] + `\nGroup Registered: ` + result[0]['group_reg']);
        }
    },
} 