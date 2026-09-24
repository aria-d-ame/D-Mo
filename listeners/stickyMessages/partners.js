const { Listener, customId } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const stickySchema = require('../../schemas/stickyMessages')

new Listener({
  name: 'Partner Sticky',
  event: 'messageCreate',

  run: async (ctx) => {
    if (ctx.author.bot) return;
    const partnerChannel = await ctx.guild.channels.fetch('1283931220887076874');

    if (ctx.channel.id !== partnerChannel.id) return;

    const oldSticky = await stickySchema.findOne({ channelId: partnerChannel.id });

    if (oldSticky) {
      const messageToDelete = await partnerChannel.messages.fetch(oldSticky.MessageId);
      if (messageToDelete) {
        await messageToDelete.delete();
      }
      await stickySchema.deleteOne({ channelId: partnerChannel.id });
    }

    const partnerStickyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:triangle_large:1276185605268832277> Open a ticket if you'd like to set up a partnership!`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });

    const partnerButton = new ButtonBuilder()
      .setCustomId(customId('partner'))
      .setLabel('Open a partner ticket!')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276263767872770108');

    const partnerRow = new ActionRowBuilder()
      .addComponents(partnerButton);

    const newSticky = await partnerChannel.send({
      embeds: [partnerStickyEmbed],
      components: [partnerRow],
    });

    await stickySchema.create({
      channelId: partnerChannel.id,
      messageId: newSticky.id,
    });
  }
})