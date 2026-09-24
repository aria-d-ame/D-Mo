const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
  name: 'modPolicy',
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const modPolicyEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:announce_red:1276188522478436393> 𝙼𝙾𝙳𝙴𝚁𝙰𝚃𝙸𝙾𝙽 𝙿𝙾𝙻𝙸𝙲𝚈 <:announce_red:1276188522478436393>`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
        **Our server has a four-warn policy for rule violations.**
        All warnings will be communicated to the offending member by **<@678344927997853742>** via DM.
        \n<:triangle_large:1276185605268832277> Punishments based on Warns
        <:triangle_small:1276263767872770108> 1st Warn ➝ **Verbal Warning**
        <:triangle_small:1276263767872770108> 2nd Warn ➝ **12 Hour Mute**
        <:triangle_small:1276263767872770108> 3rd Warn ➝ **3 Day Mute**
        <:triangle_small:1276263767872770108> 4th Warn ➝ **Ban**
        \n<:triangle_medium:1276262944836947999> You may communicate directly with server moderators to appeal punishment. An appeal will require screenshots and/or an appeal reason.
        \n<:triangle_medium:1276262944836947999> **Some actions may be punished by an immediate ban without prior warning.**`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });
    await ctx.reply({ embeds: [modPolicyEmbed], ephemeral: true });
  }
})