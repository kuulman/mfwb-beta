const index = require('../index.js')
const events = {
  gagapi: require('./basic-events-wa/gag_notif.js'),
};


class EventHandler {
  static async triggerInternalEvent(eventName, waClient, MessageMedia, message) {
    if (index.AllClient)
    try {
      const event = events[eventName.toLowerCase()];
      if (!event) {
        console.warn(`Event ${eventName} not found.`);
        return;
      }
      await event.execute(waClient, MessageMedia, message);
    } catch (error) {
      console.error(`Error running internal event ${eventName}:`, error);
    }
  }

   static async startAllEvents(waClient, MessageMedia) {
    console.log('🚀 Starting all events...');
    
    for (const [eventName, eventModule] of Object.entries(events)) {
      try {
        // If the event has an init or start method, call it
        if (eventModule.init) {
          await eventModule.init(waClient, MessageMedia);
        } else if (eventModule.start) {
          await eventModule.start(waClient, MessageMedia);
        } else if (eventModule.execute) {
          // If no specific init method, trigger the event once to initialize
          await eventModule.execute(waClient, MessageMedia);
        } else {
          console.warn(`⚠️ Event ${eventName} has no init, start, or execute method`);
          continue;
        }
      } catch (error) {
        console.error(`❌ Error starting event ${eventName}:`, error);
      }
    }
    
    console.log('🎉 All events initialization completed');
  }

  static async handleEvent(waClient, message, MessageMedia) {

  }
}

module.exports = EventHandler;
