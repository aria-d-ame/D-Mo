const messageLog = new Map();
const messageTime = 6000000; // 100 minutes in milliseconds

// Function to add a message to the log
const addMessage = (ctx) => {
    if (ctx.guild) {
        messageLog.set(ctx.id, {
            content: ctx.content,
            author: ctx.author.tag,
            channel: ctx.channel.id,
            timestamp: ctx.createdTimestamp,
            createdAt: Date.now(), // Store creation time
        });
    }
};

// Function to retrieve a message by ID
const getMessage = (id) => {
    return messageLog.get(id);
};

// Cleanup function
const cleanupOldMessages = () => {
    const now = Date.now();
    for (const [id, data] of messageLog) {
        if (now - data.createdAt > messageTime) {
            messageLog.delete(id);
            console.log(`Removed old message from log: ${id}`);
        }
    }
};

// Set interval for cleanup
setInterval(cleanupOldMessages, 6000000);

module.exports = {
    addMessage,
    getMessage,
};