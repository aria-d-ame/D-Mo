const { Listener, customId } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const stickySchema = require('../../schemas/stickyMessages')

new Listener({
  name: 'Rules Sticky',
  event: 'messageCreate',

  run: async (ctx) => {
    if (ctx.author.bot) return;
    const rulesChannel = await ctx.guild.channels.fetch('1269443795368284273');

    if (ctx.channel.id !== rulesChannel.id) return;

    const oldSticky = await stickySchema.findOne({ channelId: rulesChannel.id });

    if (oldSticky) {
      const messageToDelete = await rulesChannel.messages.fetch(oldSticky.MessageId);
      if (messageToDelete) {
        await messageToDelete.delete();
      }
      await stickySchema.deleteOne({ channelId: rulesChannel.id });
    }

    const rulesStickyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:triangle_large:1276185605268832277> Click below to view our moderation policy!`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });

    const modPolicyButton = new ButtonBuilder()
      .setCustomId(customId('modPolicy'))
      .setLabel('Moderation Policy')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188522478436393');

    const modAppButton = new ButtonBuilder()
      .setCustomId(customId('modApp'))
      .setLabel('Open Mod Application')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276188470250832014');

    const ruleRow = new ActionRowBuilder()
      .addComponents(modPolicyButton, modAppButton);

    const newSticky = await rulesChannel.send({
      embeds: [rulesStickyEmbed],
      components: [ruleRow],
    });

    await stickySchema.create({
      channelId: rulesChannel.id,
      messageId: newSticky.id,
    });
  }
})