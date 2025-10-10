const { DailyEvent, editTimestamp, deleteHWAfterUse } = require('../../api/database.js');

module.exports = {
  async execute(waClient, MessageMedia, message) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Get a custom date format
    function formatDate(date) {
      const day = date.getUTCDate().toString().padStart(2, '0');
      const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = date.getUTCFullYear();
      const hour = date.getUTCHours().toString().padStart(2, '0');
      const minute = date.getUTCMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year}T${hour}:${minute}`;
    }

    // Get Now and Date based on system format
    function getNowAndTomorrow() {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(now.getUTCDate() + 1);
      return { now, tomorrow };
    }

    async function handleDailySchedule(event, group_reg, id) {
      const { tomorrow } = getNowAndTomorrow();
      const tomorrowName = days[tomorrow.getUTCDay()];
      const schedule = event.japel?.[tomorrowName];

      if (!schedule) return;

      const japelKey = Object.keys(schedule).find(k => k.includes('Japel'));
      const japel = japelKey ? schedule[japelKey] : null;
      if (!japel || japel.length === 0) return;

      const header = event.header ? event.header + '\n\n' : '';
      const footer = event.footer ? '\n\n' + event.footer : '';
      const response = `${header} 📅 Schedule for: *${tomorrowName}*\n${japel}${footer}`;

      await waClient.sendMessage(group_reg, response);
      await editTimestamp(id, formatDate(tomorrow));

      console.log(`[Schedule Handler] Daily Schedule ${id} sent to group: ${group_reg}`);
    }

    async function handlePlainSchedule(event, group_reg, id) {
      await waClient.sendMessage(group_reg, event.contents);
      const { tomorrow } = getNowAndTomorrow();
      await editTimestamp(id, formatDate(tomorrow));

      console.log(`[Schedule Handler] Plain Schedule ${id} sent to group: ${group_reg}`);
    }

    async function handleHomework(event, group_reg, id) {
      const response = event.reason;

      try {
        if (event.url_img && event.url_img.startsWith('http')) {
          try {
            const media = await MessageMedia.fromUrl(event.url_img);
            await waClient.sendMessage(group_reg, media, { caption: response });
          } catch (err) {
            console.log(`[Media Error] Failed to fetch media: ${event.url_img}`, err);
            await waClient.sendMessage(group_reg, response);
          }
        } else {
          await waClient.sendMessage(group_reg, response);
        }

        await deleteHWAfterUse(id);
        console.log(`[Schedule Handler] Homework ${id} sent to group: ${group_reg}`);
      } catch (err) {
        console.log(`[Schedule Handler] Error sending homework ${id} to ${group_reg}:`, err);
      }
    }

    async function CheckEvent() {
      const { now } = getNowAndTomorrow();
      const SKMTFormatDate = formatDate(now);

      try {
        const { result = [], resultHW = [] } = await DailyEvent(SKMTFormatDate);
        const events = [...result, ...resultHW];

        if (events.length === 0) {
          console.log('[Schedule Handler] No scheduled events found.', SKMTFormatDate);
          return;
        }

        for (const event of events) {
          const { type, _id: id, group_reg } = event;
          try {
            if (type === "Daily Schedule") {
              await handleDailySchedule(event, group_reg, id);
            } else if (type === "Plain Schedule") {
              await handlePlainSchedule(event, group_reg, id);
            } else if (type === "homework") {
              await handleHomework(event, group_reg, id);
            }
          } catch (err) {
            console.log(`[Event Handler] Error on event ${id}:`, err);
          }
        }
      } catch (err) {
        console.log('[Schedule Handler] Error fetching events:', err);
      }
    }

    // Check every 1 minute
    await CheckEvent();
    setInterval(CheckEvent, 60 * 1000);

    console.log('[Schedule Handler] Schedule handler is running...');
  }
};
