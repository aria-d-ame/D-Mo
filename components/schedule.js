const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
  name: 'schedule',
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const scheduleEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝙴𝚅𝙴𝙽𝚃 𝚂𝙲𝙷𝙴𝙳𝚄𝙻𝙸𝙽𝙶 <:xannounce:1276188470250832014>`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
        <:xtriangle_small:1276263767872770108> Weekly Game Event
        <:xtriangle_small:1276263767872770108> Bi-weekly Activity Tournament
        <:xtriangle_small:1276263767872770108> Monthly Art Event
        <:xtriangle_small:1276263767872770108> Monthly Server Event`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });
    await ctx.reply({ embeds: [scheduleEmbed], ephemeral: true });
  }
})