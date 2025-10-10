const { get } = require('pm2');

 module.exports = {
    name: 'createUser',
    description: 'Create a user profile in the database',
    usage: '.cu [email] [password]',

    async execute(waClient, message, MessageMedia, dcClient) {
    const { createNewUser, UserAccInput, checkUser } = require('../../api/database');
        const chat = await message.getChat();
        const fulltext = message.body.slice(3).trim();
        const args = fulltext.split(' ');
        const dangerousChars = /[\x00-\x1F\x7F-\x9F\\"'`<>&|;$]/;
        let Uemail = args[0];
        let Upass = args.slice(1).join(' ');
        let Unum = message.from

        if (!Uemail || !Upass) {
            await message.reply('Please provide both email and password. Example: `.cu user user1234`');
            return;
        }
        if (chat.isGroup) {
            await message.reply('This command can only be used in private chat.');
            return;
        }
        if (Uemail.length < 5 || !Uemail.includes('@') || !Uemail.includes('.')) {
            await message.reply('Please provide a valid email address.');
            return;
        }
        if (Upass.length < 6 || Upass.length > 20 || dangerousChars.test(Upass)) {
            await message.reply('Password must be 6-20 characters long and cannot contain special characters.');
            return;
        }
        UserAccInput(Uemail, Upass, Unum);
        const result = await checkUser(Unum);
        if (!result || result.length === 0) {
            await createNewUser(Uemail, Upass, Unum);
            await message.reply(`User created successfully!\n\nEmail: ${Uemail}`);
        } else {
            await message.reply('Cannot create user, number already registered. Registered Email: ' + result[0]['email']);
            return;
        }
    },
} 