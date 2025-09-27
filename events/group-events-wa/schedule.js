const { DailyEvent, editTimestamp } = require('../../database.js');

module.exports = {
    async execute(waClient, MessageMedia, message) {

        // SKMT Date Format
        function SKMTFormatDate() {
            const now = new Date();
            const hour = now.getUTCHours().toString().padStart(2, '0');
            const minute = now.getUTCMinutes().toString().padStart(2, '0');
            const date = now.getUTCDate().toString().padStart(2, '0');
            const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = now.getUTCFullYear();
            return `${date}/${month}/${year}T${hour}:${minute}`;
        }

        async function japelParse() {
            const FormatDate = SKMTFormatDate();
            console.log(FormatDate)
            let date = now.getUTCDate().toString().padStart(2, '0');
            const events = await DailyEvent(FormatDate);
            if (!events || events.length === 0) {
                console.log('[Schedule Handler] No scheduled events found.');
                return;
            }
            
            const tommorow =  (now.getDay() +1) % 7; // Get current day (0-6)
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            const tommorowName = days[tommorow] // Convert number to name (e.g. 1 => "Monday")

            for (const eventData of events) {
                try {
                    let response;
                    const schedule = eventData.japel?.[tommorowName]
                    if (!schedule) {
                        return console.log(`[Schedule Handler] User Schedule not found for ${FormatDate}`);
                    }
    
                    const japelKey = Object.keys(schedule).find(k => k.includes('Japel'))
                    const japel = schedule[japelKey]
                    const header = eventData.header ? eventData.header + '\n\n' : '';
                    const footer = eventData.footer ? '\n\n' + eventData.footer : '';
                    const id = eventData._id;
    
                    console.log(`📅 Days: ${tommorowName}\n📚 Schedule:\n${japel}`)
                    response = `${header} 📅 Schedule for: ${tommorowName}\n${japel}${footer}`
    
                    await waClient.sendMessage(eventData.group_reg, response);
                    date = tommorow;
                    await editTimestamp(id, FormatDate);
                    console.log(`[Schedule Handler] ${id} schedule sent to group: ${eventData.group_reg}`);
                } catch (err) {
                    console.log(`[Event Handler] Error: ` + err)
                    return
                }
            }
        }    
        await japelParse()
        setInterval(() => { japelParse() }, 60000);
    }
}
