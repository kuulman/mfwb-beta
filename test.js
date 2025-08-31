require('dotenv').config();
const express =  require('express')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const { Client: discordClient, GatewayIntentBits, Collection, Events } = require('discord.js')
const { LocalAuth, Client, MessageMedia } = require('whatsapp-web.js')
const os = require('os');
const fs = require('fs');
const path = require('path');
const CommandHandler = require('./commandHandlers.js')
const EventHandler = require('./eventHandlers.js')
const { UpdateData, getWeatherOutput, getEggOutput, getGearOutput, getSeedOutput, app: API_app} = require('./Grow a Garden/api.js')

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
waClient.on('ready', () => console.log('Client is ready!')); // If this bot succesfully login to number
waClient.on('message', async message =>{ // Function for checking messages
    const messageBody = message.body.trim().toLowerCase(); // Make it to lowercase
    if (message.from.endsWith('@newsletter') || message.from.endsWith('@c.us') || message.from.endsWith('@g.us')) { // Check if the message is from a selected group
        const dcChannelID = '1406605639274332170';
        const dcChannel = dcClient.channels.cache.get(dcChannelID);
        const msgLog = `${message.from} has sent you message: ${messageBody}`
        console.log(msgLog) // Write that message to 
        await dcChannel.send(msgLog); // Send that message to Discord Channel
    } 
    if (message.body.startsWith = ('.')) {
        await CommandHandler.handleCommand(waClient, message);
    }
});

waClient.initialize() // Execution code for WA Client
dcClient.login(DISCORD_TOKEN);


// Variable untuk menyimpan data sebelumnya
let previousApiData = null;

// Fungsi untuk mengirim notifikasi WhatsApp
async function sendWhatsAppNotification(updateType, data) {
    try {
        let message = '';
        
        switch(updateType) {
            case 'weather':
                message = `${data}`;
                break;
            case 'egg':
                message = `${data}`;
                break;
            case 'gear':
                message = `${data}`;
                break;
            case 'seed':
                message = `${data}`;
                break;
            default:
                message = `${data}`;
        }

        // Kirim ke group (jika  WA_GROUP_ID ada)
        if ('120363401271520921@g.us') {
            await waClient.sendMessage('120363401271520921@g.us', message);
            console.log(`✅ WA notification sent to group: ${updateType}`);
        }

        // Kirim ke channel (jika WA_CHANNELS_JID ada)
        if (WA_CHANNELS_JID) {
            await waClient.sendMessage(WA_CHANNELS_JID, message);
            console.log(`✅ WA notification sent to channel: ${updateType}`);
        }

    } catch (error) {
        console.error('❌ Error sending WhatsApp notification:', error);
    }
}

// Fungsi untuk mengecek perubahan data
function hasDataChanged(newData, oldData) {
    if (!oldData) return true; // First time check
    return JSON.stringify(newData) !== JSON.stringify(oldData);
}

// Fungsi monitoring utama
async function checkForApiUpdates() {
    try {
        // Ambil data terbaru menggunakan fungsi yang sudah ada
        const currentWeather = await getWeatherOutput();
        const currentEgg = await getEggOutput();
        const currentGear = await getGearOutput();
        const currentSeed = await getSeedOutput();

        const currentApiData = {
            weather: currentWeather,
            egg: currentEgg,
            gear: currentGear,
            seed: currentSeed,
            timestamp: new Date().toISOString()
        };

        // Cek apakah ada perubahan
        if (hasDataChanged(currentApiData, previousApiData)) {
            console.log('🔄 API data has changed, sending notifications...');

            // Kirim notifikasi untuk setiap jenis data yang berubah
            if (!previousApiData || currentApiData.weather !== previousApiData.weather) {
                await sendWhatsAppNotification('weather', currentWeather);
            }
            
            if (!previousApiData || currentApiData.egg !== previousApiData.egg) {
                await sendWhatsAppNotification('egg', currentEgg);
            }
            
            if (!previousApiData || currentApiData.gear !== previousApiData.gear) {
                await sendWhatsAppNotification('gear', currentGear);
            }
            
            if (!previousApiData || currentApiData.seed !== previousApiData.seed) {
                await sendWhatsAppNotification('seed', currentSeed);
            }

            // Update data sebelumnya
            previousApiData = currentApiData;
        } else {
            console.log('📊 No API changes detected');
        }

    } catch (error) {
        console.error('❌ Error checking API updates:', error);
    }
}

app.listen(PORT, () => console.log(`Vulcano 1.5 || Server is running on port ${PORT} \nPlease wait. This gonna take less/more than 1 minute`)); // Sent this to console if succesfully connected to node.js
API_app.listen(3500, () => {
    console.log(`API is running on port 3500`);
});
UpdateData()


// Additional Information
// If you want change number or log out from whatsapp, you can delete the folder in `./wwebjs_auth` & `./wwebjs_cache` and run the bot again. 
// It will ask you to scan the QR Code again.
// If there is error `Cannot read properties of undefined (reading 'getChat')`, just restart the bot. 
// Because this error is caused by the WA Client not ready yet when there is rare stock.

