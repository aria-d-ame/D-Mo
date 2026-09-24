const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const logChannelId = '1278877530635374675';
const { getMessage } = require('../../utils/messageLog');

new Listener({
  name: 'Message Edit',
  event: 'messageUpdate',

  run: async (oldMessage, ctx) => {
    if (!ctx.guild) return;
    if (ctx.author.bot) return;

    const originalMessage = getMessage(oldMessage.id);
    if (!originalMessage) {
      console.log(`Original message data timed out for message ID ${ctx.message.id} (${ctx.channel.id}, ${ctx.author.id}).`);
      return; 
    }

    if (originalMessage.content === ctx.content) return;

    const editEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('[ ✏️ ] Message Edited')
      .addFields(
        { name: '📬 | Channel:', value: `<#${ctx.channel.id}>`, inline: true },
        { name: '👤 | Author:', value: `<@${ctx.author.id}>`, inline: true },
        { name: '\n', value: '\n', inline: false },
        { name: '🗞️ | Original Content:', value: `"${originalMessage.content}"`, inline: false },
        { name: '📝 | New Content:', value: `"${ctx.content}"`, inline: false},
        { name: '\n', value: '\n', inline: false },
        { name: ' ', value: `Created: <t:${Math.floor(originalMessage.timestamp / 1000)}:t>`, inline: true },
        { name: ' ', value: `Edited: <t:${Math.floor(Date.now() / 1000)}:t>`, inline: true }
      )
      .setThumbnail(ctx.author.displayAvatarURL())

    const logChannel = ctx.guild.channels.cache.get(logChannelId);
    if (logChannel) {
        logChannel.send({ embeds: [editEmbed] });
    } else {
        console.error(`Log channel with ID ${logChannelId} not found.`);
    }
  }
})