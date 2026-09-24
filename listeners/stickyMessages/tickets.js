const { Listener, customId } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const stickySchema = require('../../schemas/stickyMessages')

new Listener({
  name: 'Ticket Sticky',
  event: 'messageCreate',

  run: async (ctx) => {
    if (ctx.author.bot) return;
    const ticketChannel = await ctx.guild.channels.fetch('1302727946989080706');

    if (ctx.channel.id !== ticketChannel.id) return;

    const oldSticky = await stickySchema.findOne({ channelId: ticketChannel.id });

    if (oldSticky) {
      const messageToDelete = await ticketChannel.messages.fetch(oldSticky.MessageId);
      if (messageToDelete) {
        await messageToDelete.delete();
      }
      await stickySchema.deleteOne({ channelId: ticketChannel.id });
    }

    const ticketStickyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:triangle_large:1276185605268832277> Open a ticket with any of the buttons below!`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
        \n<:triangle_small:1276263767872770108> Please use a report ticket if you'd like to report a user!
        <:triangle_small:1276263767872770108> More about mod application and partner tickets can be found in their respective channels.
        <:triangle_small:1276263767872770108> If your ticket does not fit the any criteria please use a general ticket!`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });

    const partnerButton = new ButtonBuilder()
      .setCustomId(customId('partner'))
      .setLabel('Open a partner application!')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276263767872770108');

    const modAppButton = new ButtonBuilder()
      .setCustomId(customId('modApp'))
      .setLabel('Open mod application!')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188470250832014');

    const reportButton = new ButtonBuilder()
      .setCustomId(customId('modReport'))
      .setLabel('Make a report!')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188522478436393');

    const feedbackButton = new ButtonBuilder()
      .setCustomId(customId('general'))
      .setLabel('Open a general ticket!')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188470250832014');

    const ticketRow = new ActionRowBuilder()
      .addComponents(reportButton, feedbackButton, partnerButton, modAppButton);

    const newSticky = await ticketChannel.send({
      embeds: [ticketStickyEmbed],
      components: [ticketRow],
    });

    await stickySchema.create({
      channelId: ticketChannel.id,
      messageId: newSticky.id,
    });
  }
})