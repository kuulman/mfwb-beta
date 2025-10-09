const commands = {
    info: require('./basic-commands/info.js'),
    server_usage: require('./basic-commands/server_usage.js'),
    seed_stock: require('./gag-commands/seed_stock.js'),
    egg_stock: require('./gag-commands/egg_stock.js'),
    gear_stock: require('./gag-commands/gear_stock.js'),
    weather: require('./basic-commands/weather.js'),
    hp: require('./group-commands/hideping.js'),
    cu: require('./basic-commands/createUser.js'),
    getchat: require('./dev-commands/getchat.js'),
    profile: require('./basic-commands/profile.js'),
    hw: require('./forsch-commands/addhomework.js'),
    rks: require('./basic-commands/ringkas.js'),
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
                return
            }
        } else {
            return
        }
    }
}

module.exports = CommandHandler;