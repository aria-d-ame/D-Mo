const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const logChannelId = '1278877530635374675';
const { getMessage } = require('../../utils/messageLog');

new Listener({
  name: 'Message Delete',
  event: 'messageDelete',

  run: async (ctx) => {
    if (!ctx.guild) return;
    if (ctx.author.bot) return;

    const originalMessage = getMessage(ctx.id);
    if (!originalMessage) {
      console.log(`Original message data timed out for message ID ${ctx.message.id} (${ctx.channel.id}, ${ctx.author.id}).`);
      return; 
    }

    const deleteEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('[ 🗑️ ] Message Deleted')
      .addFields(
        { name: '📬 | Channel:', value: `<#${ctx.channel.id}>`, inline: true },
        { name: '👤 | Author:', value: `<@${ctx.author.id}>`, inline: true },
        { name: '\n', value: '\n', inline: false },
        { name: '📝 | Content:', value: `"${originalMessage.content}"`, inline: false },
        { name: '\n', value: '\n', inline: false },
        { name: ' ', value: `Created: <t:${Math.floor(originalMessage.timestamp / 1000)}:t>`, inline: true },
        { name: ' ', value: `Deleted: <t:${Math.floor(Date.now() / 1000)}:t>`, inline: true }
      )
      .setThumbnail(ctx.author.displayAvatarURL())

    const logChannel = ctx.guild.channels.cache.get(logChannelId);
    if (logChannel) {
        logChannel.send({ embeds: [deleteEmbed] });
    } else {
        console.error(`Log channel with ID ${logChannelId} not found.`);
    }
  }
})