const weather = require('./wa-commands/weather.js');

const commands = {
    info: require('./wa-commands/info.js'),
    server_usage: require('./wa-commands/server_usage.js'),
    seed_stock: require('./wa-commands/gag-commands/seed_stock.js'),
    egg_stock: require('./wa-commands/gag-commands/egg_stock.js'),
    gear_stock: require('./wa-commands/gag-commands/gear_stock.js'),
    weather: require('./wa-commands/weather.js'),
};

class CommandHandler {
    static async handleCommand(waClient, message, MessageMedia) {
        const args = message.body.slice(1).trim().split(' ');
        const commandName = args.shift().toLowerCase();

        // Check if command exists
        if (message.body.startsWith('.')) {
            try {
                await commands[commandName].execute(waClient, message, MessageMedia, args);
            } catch (error) {
                console.error(`Error executing command ${commandName}:`, error);
                await message.reply(`❌ .${commandName} does not exist`);
            }
        } else {
            return
        }
    }
}

module.exports = CommandHandler;