const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
  name: 'mcServer',
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const mcServerEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝟷.𝟸𝟷.𝟷 𝙹𝙰𝚅𝙰 𝚂𝙴𝚁𝚅𝙴𝚁 <:xannounce:1276188470250832014>`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
        <:xannounce:1276188470250832014> **𝙹𝚘𝚒𝚗𝚒𝚗𝚐 𝚝𝚑𝚎 𝚂𝚎𝚛𝚟𝚎𝚛**<:xannounce:1276188470250832014>
        <:triangle_medium:1276262944836947999> To gain access to our Minecraft server, you must first be whitelisted. To do so you must have the <@&1279288535748182016> role from Channels & Roles!
        <:triangle_small:1276263767872770108> From there you will be able to view the <#1279288481100857387> channel where you can send your username and either <@1068992693046349834> or <@672198334789844994> will whitelist you!
        <:triangle_small:1276263767872770108> Once you're whitelisted, you can join the Minecraft server through the server address **adesptusaria.minekeep.gg**.
        «════✧ ✦ ✧ ✦ ✧════»
        <:xannounce:1276188470250832014>**𝙰𝚍𝚍𝚒𝚝𝚒𝚘𝚗𝚊𝚕 𝙸𝚗𝚏𝚘 𝚊𝚗𝚍 𝙴𝚡𝚙𝚎𝚌𝚝𝚊𝚝𝚒𝚘𝚗𝚜**<:xannounce:1276188470250832014>
        <:triangle_medium:1276262944836947999> Our server is a 1.21.1 Vanilla Java Edition server!
        <:triangle_medium:1276262944836947999> Mods and texture packs are fair game. The server itself does not have mods on it, but if you want JEI, a minimap, etc. feel free.
        <:triangle_medium:1276262944836947999> Cracked accounts will not be able to join, sorry.
        <:triangle_medium:1276262944836947999> The server is run through 3rd-party hosting! Every now and then, it will go down unexpectedly. This should never last more than 10 minutes.
        <:triangle_medium:1276262944836947999> The server is not 24/7! However, anyone can start it. If the server isn't on, just join the server's address and it will begin starting. Expect around half a minute of wait time.
        <:triangle_medium:1276262944836947999> Keep inventory is on! But it's per dimension and keep inventory is not available in The End yet.
        <:triangle_medium:1276262944836947999> No griefing or theft, duh. Don't mess with other people's stuff or we will remove you from the whitelist.
        <:triangle_medium:1276262944836947999> <@1068992693046349834> and <@672198334789844994> are the server operators and have access to console commands. If you need anything, feel free to @ us.`)
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });
    await ctx.reply({ embeds: [mcServerEmbed], ephemeral: true });
  }
})