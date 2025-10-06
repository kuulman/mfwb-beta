const { DailyEvent, editTimestamp, deleteHWAfterUse } = require('../../database.js');

module.exports = {
    async execute(waClient, MessageMedia, message) {

        function getDateBySKMTFormat() {
            const now = new Date();
            const hour = now.getUTCHours().toString().padStart(2, '0');
            const minute = now.getUTCMinutes().toString().padStart(2, '0');
            const date = now.getUTCDate().toString().padStart(2, '0');
            const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = now.getUTCFullYear();
            return `${date}/${month}/${year}T${hour}:${minute}`;
        }

        function getTommorowDate() {
            const now = new Date();
            now.setUTCDate(now.getUTCDate() + 1);
            const hour = now.getUTCHours().toString().padStart(2, '0');
            const minute = now.getUTCMinutes().toString().padStart(2, '0');
            const date = now.getUTCDate().toString().padStart(2, '0');
            const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
            const year = now.getUTCFullYear();
            return `${date}/${month}/${year}T${hour}:${minute}`;
        }

        async function CheckEvent() {
            const SKMTFormatDate = getDateBySKMTFormat();
            const { result, resultHW } = await DailyEvent(SKMTFormatDate);

            if ((!result || result.length === 0) && (!resultHW || resultHW.length === 0)) {
                console.log('[Schedule Handler] No scheduled events found.');
                console.log(SKMTFormatDate);
                return;
            }

            const events = [...(result || []), ...(resultHW || [])];

            for (const eventData of events) {
                try {
                    const { type, _id: id, group_reg } = eventData;

                    if (type === "Daily Schedule") {
                        const now = new Date();
                        const tommorow = (now.getUTCDay() + 1) % 7;
                        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const tommorowName = days[tommorow];

                        const schedule = eventData.japel?.[tommorowName];
                        if (!schedule) continue;

                        const japelKey = Object.keys(schedule).find(k => k.includes('Japel'));
                        const japel = japelKey ? schedule[japelKey] : null;
                        if (!japel || japel.length === 0) continue;

                        const header = eventData.header ? eventData.header + '\n\n' : '';
                        const footer = eventData.footer ? '\n\n' + eventData.footer : '';
                        const response = `${header} 📅 Schedule for: *${tommorowName}*\n${japel}${footer}`;

                        await waClient.sendMessage(group_reg, response);

                        const tommorowDate = getTommorowDate();
                        await editTimestamp(id, tommorowDate);

                        console.log(`[Schedule Handler] Daily Schedule ${id} sent to group: ${group_reg}`);
                    }
                    else if (type === "Plain Schedule") {
                        const response = eventData.contents;
                        await waClient.sendMessage(group_reg, response);

                        const tommorowDate = getTommorowDate();
                        await editTimestamp(id, tommorowDate);

                        console.log(`[Schedule Handler] Plain Schedule ${id} sent to group: ${group_reg}`);
                    }
                    else if (type === "homework") {
                        const response = eventData.reason;
                        try {
                            if (!eventData.url_img || eventData.url_img == null || !eventData.url_img.startsWith('http')) {
                                // Send text if invalid
                                await waClient.sendMessage(group_reg, response);
                            } else {
                                let media = null;
                                try {
                                    media = await MessageMedia.fromUrl(eventData.url_img);
                                } catch (err) {
                                    console.log(`[Media Error] Failed to fetch media: ${eventData.url_img}`, err);
                                }

                                if (media) {
                                    await waClient.sendMessage(group_reg, media, { caption: response });
                                } else {
                                    // Send text if failed
                                    await waClient.sendMessage(group_reg, response);
                                }
                            }

                            await deleteHWAfterUse(id);
                            console.log(`[Schedule Handler] Homework ${id} sent to group: ${group_reg}`);
                        } catch (err) {
                            console.log(`[Schedule Handler] Error sending homework ${id} to ${group_reg}:`, err);
                        }
                    }

                } catch (err) {
                    console.log(`[Event Handler] Error:`, err);
                    continue;
                }
            }
        }

        await CheckEvent();
        setInterval(CheckEvent, 10000);
        console.log('[Schedule Handler] Schedule handler is running...');
    }
}
