require('dotenv').config();
const express =  require('express')
const qrcode = require('qrcode-terminal')
const { Client: discordClient, GatewayIntentBits, Collection, Events } = require('discord.js')
const { LocalAuth, Client, MessageMedia } = require('whatsapp-web.js')
const fs = require('fs');
const CommandHandler = require('./wa-commands/commandHandlers.js')
const EventHandler = require('./events/eventHandlers.js')
const { app: API_app, runAPI } = require('./api/GAGapi.js')

const app = express()
const PORT = process.env.PORT || 3000;

// Discord Setup
const dcClient = new discordClient({ // DC Client Config
    intents: [
     GatewayIntentBits.Guilds,
     GatewayIntentBits.GuildMessages,
     GatewayIntentBits.MessageContent,   
    ]
})

dcClient.commands = new Collection(); // Create a new collection for commands

const commandFiles = fs.readdirSync('./dc-commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const dcCommandHandler = require(`./dc-commands/${file}`)
  dcClient.commands.set(dcCommandHandler.data.name, dcCommandHandler);
}
const DISCORD_TOKEN = process.env.DISCORD_TOKEN; // Check .env or make new if you are clone this repo
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID; // Check .env or make new if you are clone this repo
const WA_GROUP_ID = process.env.WA_GROUP_ID;
const WA_CHANNELS_JID = process.env.WA_CHANNELS_JID;

dcClient.on('clientReady', () => {
    console.log(`Discord bot is ready`); // Write that to console if the DC Client is ready
});

// Slash command handler
dcClient.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = dcClient.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Terjadi kesalahan.', ephemeral: true });
    }
  }

  // Tombol
  if (interaction.isButton()) {
    handleButton(interaction);
  }
});

// Whatsapp Setup
const waClient = new Client({  //WA Client
    authStrategy: new LocalAuth({clientId: 'GAG-STOCK'}),
    puppeteer: {
        headless: true, // Set to false if you want to see the browser
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
        ],
    },
})

waClient.on('qr', (qr) => qrcode.generate(qr, { small: true })); // Generate QR Code
waClient.on('authenticated', () => console.log('Client is authenticated')); // If QR Code scanned
waClient.on('loading_screen', (percent) => console.log(`Loading... ${percent}%`)); // If loading screen is shown

waClient.on('ready', async () => {
  console.log('Client is ready!'); // If this bot succesfully login to number
  API_app.listen(3500, () => {
    console.log(`API is running on port 3500`);
  });
  await EventHandler.startAllEvents(waClient, MessageMedia);
});
waClient.on('message', async message =>{ // Function for checking messages
    const messageBody = message.body.trim().toLowerCase(); // Make it to lowercase
    const getState = await waClient.getState()
    if (message.from.endsWith('@newsletter') || message.from.endsWith('@c.us') || message.from.endsWith('@g.us')) { // Check if the message is from a selected group
        const msgLog = `${message.from} has sent you message: ${messageBody}`
        console.log(msgLog) // Write that message to 
        await dcChannel.send(msgLog); // Send that message to Discord Channel
    } 
    if (message.body.startsWith = ('.')) {
      await CommandHandler.handleCommand(waClient, message);
    }
    if (getState == 'CONNECTED') {
      await EventHandler.handleEvent(waClient, message)
    }
});

waClient.initialize() // Execution code for WA Client
dcClient.login(DISCORD_TOKEN);

app.listen(PORT, () => console.log(`Vulcano 1.5 || Server is running on port ${PORT} \nPlease wait. This gonna take less/more than 1 minute`)); // Sent this to console if succesfully connected to node.js



// Additional Information
// If you want change number or log out from whatsapp, you can delete the folder in `./wwebjs_auth` & `./wwebjs_cache` and run the bot again. 
// It will ask you to scan the QR Code again.
// If there is error `Cannot read properties of undefined (reading 'getChat')`, just restart the bot. 
// Because this error is caused by the WA Client not ready yet when there is rare stock.