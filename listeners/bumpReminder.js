const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Bump Reminder',
  event: 'messageCreate',

  run: async (ctx) => {
    const timerDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const bumpSchema = require('../schemas/bumpSchema.js');
    let timer;
    // Check if the message is from Disboard
    if (ctx.author.id === '302050872383242240') {
        const guildId = ctx.guild.id;
        const channelId = ctx.channel.id; // Get the channel ID
        const responseChannel = ctx.guild.channels.cache.get(channelId);

        // Save the current bump time
        await bumpSchema.findOneAndUpdate(
            { guildId, channelId },
            { lastBumpTime: new Date() },
            { upsert: true, new: true }
        );


        if (responseChannel) {
            const remind = new EmbedBuilder()
                .setColor(0x8269c2)
                .setTimestamp()
                .setFooter({
                    text: `${ctx.guild.name}`, // Footer text
                    iconURL: ctx.guild.iconURL() // Optional: Server icon URL
                })
                .setDescription(`<:xtriangle_small:1276263767872770108> 𝚃𝚑𝚊𝚗𝚔 𝚢𝚘𝚞 𝚏𝚘𝚛 𝚋𝚞𝚖𝚙𝚒𝚗𝚐!\nI'll be back in 2 hours!`)
            await responseChannel.send({ embeds: [remind] });

            // Clear any existing timer
            if (timer) clearTimeout(timer);

            // Set a new timer
            timer = setTimeout(async () => {
                const channel = ctx.guild.channels.cache.get(channelId);
                if (channel) {
                    const remind2 = new EmbedBuilder()
                        .setColor(0x8269c2)
                        .setTimestamp()
                        .setFooter({
                            text: `${ctx.guild.name}`, // Footer text
                            iconURL: ctx.guild.iconURL() // Optional: Server icon URL
                        })
                        .setTitle(`<:xtriangle_small:1276263767872770108> 𝙸𝚝'𝚜 𝚝𝚒𝚖𝚎 𝚝𝚘 𝚋𝚞𝚖𝚙!`)
                        .setDescription(`<:xtriangle_small:1276263767872770108> Do /bump to bump 𝔸𝕕𝕖𝕡𝕥𝕦𝕤 𝔸𝕣𝕚𝕒⁺₊✧!`)
                    await responseChannel.send({ content: '<:xannounce:1276188470250832014> <@&1279272272087220276> <:xannounce:1276188470250832014>', embeds: [remind2] });

                }
            }, timerDuration);
        } else {
            console.error('Channel not found');
        }
    }
  }
})