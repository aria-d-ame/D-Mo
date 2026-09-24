const { Listener, customId } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const stickySchema = require('../../schemas/stickyMessages')
let previousStickyMessage = null;

new Listener({
  name: 'Events Sticky',
  event: 'messageCreate',

  run: async (ctx) => {
    if (ctx.author.bot) return;
    const eventsChannel = await ctx.guild.channels.fetch('1281276361914318871');

    if (ctx.channel.id !== eventsChannel.id) return;

    const oldSticky = await stickySchema.findOne({ channelId: eventsChannel.id });

    if (oldSticky) {
      const messageToDelete = await eventsChannel.messages.fetch(oldSticky.messageId);
      if (messageToDelete) {
        await messageToDelete.delete();
      }
      await stickySchema.deleteOne({ channelId: eventsChannel.id });
    }

    const eventsStickyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:triangle_large:1276185605268832277> Click below to view addition information!`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });

    const birthdaysButton = new ButtonBuilder()
      .setCustomId(customId('birthdays'))
      .setLabel('Birthdays')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276262944836947999');

    const scheduleButton = new ButtonBuilder()
      .setCustomId(customId('Schedule'))
      .setLabel('Event Schedule')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276262944836947999');

    const mcServerButton = new ButtonBuilder()
      .setCustomId(customId('mcServer'))
      .setLabel('Minecraft Server')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1276262944836947999');

    const eventsRow = new ActionRowBuilder()
      .addComponents(birthdaysButton, scheduleButton, mcServerButton)

    async function sendStickyMessage(){
      
      if (previousStickyMessage) {
        try {
          await previousStickyMessage.delete();
          
        } catch (error){
          console.error("Error deleting sticky message:", error);
        }
      }

      const newSticky = await eventsChannel.send({
        embeds: [eventsStickyEmbed],
        components: [eventsRow],
      });
    
      previousStickyMessage = newSticky;
    }
      const newSticky = await sendStickyMessage();
    

    await stickySchema.create({
      channelId: eventsChannel.id,
      messageId: newSticky.id,
    });
  }
})
