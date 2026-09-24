const messageTime = 6000000; // e.g., 100 minutes in milliseconds
const { Listener } = require('gcommands');
const { addMessage } = require('../../utils/messageLog.js');

new Listener({
  name: 'Message Creation',
  event: 'messageCreate',

  run: async (ctx) => {
    addMessage(ctx);
  }
})
