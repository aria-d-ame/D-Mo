const { GClient, Plugins, Command, Component } = require('gcommands');
const { GatewayIntentBits, Partials } = require('discord.js');
const { join } = require('path');
require('dotenv').config();
import("mongoose");
const mongoose = require('mongoose');

Command.setDefaults({
	cooldown: '10s',
});

// Set the default error function
Component.setDefaults({
    onError: (ctx, error) => {
        return ctx.reply('Oh no! Something went wrong!')
    }
});

// Search for plugins in node_modules
Plugins.search(__dirname);

const client = new GClient({
    // Register directories
    dirs: [
        join(__dirname, 'commands'),
        join(__dirname, 'components'),
        join(__dirname, 'listeners')
    ],
    // Enables message support
    messageSupport: true,
    // Sets prefix for message commands
    messagePrefix: 'd-',
    devGuildId: process.env.devGuildId,
    // Sets intents 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildMembers,      
        GatewayIntentBits.GuildMessageReactions,
      ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User, Partials.Reaction]
});

// Connects mongoDB
 (async function connect() {
    mongoose.set('strictQuery', false);
    try {
        console.log(`🔄 Connecting to MongoDB...`);

        await mongoose.connect(process.env.mongoToken,);

        console.log(`✅ MongoDB connected successfully!`);
    } catch (error) {
        console.log(`Error ${error}`);
        console.log("⚠️ MongoDB did not connect!");
    }
})();

// Login to the discord API
client.login(process.env.botToken,).catch(console.error);