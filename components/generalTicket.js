const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

new Component({
  name: 'general',
  type: [ComponentType.BUTTON],

  run: async (ctx) => {
    ctx.reply({ content: `A ticket is being created for you!`, ephemeral: true });
    const applicationChannel = await ctx.guild.channels.create({
      name: `general-${ctx.user.username}`,
      type: 0, // 0 for text channel
      permissionOverwrites: [
          {
              id: ctx.user.id, 
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory], // Permissions to allow
              deny: [PermissionsBitField.Flags.ManageMessages], // Permissions to deny
          },
          {
              id: ctx.guild.id, // @everyone role ID
              deny: [PermissionsBitField.Flags.ViewChannel], // Deny view channel for everyone by default
          }
      ]
  });

  const generalEmbed = new EmbedBuilder()
    .setAuthor({
      name: ctx.user.username,
      iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 })
    })
    .setColor(0x8269c2)
    .setTitle(`<:xannounce:1276188470250832014> 𝙶𝙴𝙽𝙴𝚁𝙰𝙻 𝚃𝙸𝙲𝙺𝙴𝚃 <:xannounce:1276188470250832014>`)
    .setDescription(`«════✧ ✦ ✧ ✦ ✧════» 
      <:triangle_small:1276263767872770108> Hello! Please state the purpose of your ticket, and I will get back to you if there are further steps!
      \n<:triangle_small:1276263767872770108> **If you have any questions, feel free to ask!**`)

  await applicationChannel.send({ content: `<@${ctx.user.id}>`, embeds: [generalEmbed] });

  const modChannel = await ctx.guild.channels.fetch('1276650555133136926');
  await modChannel.send(`<@${ctx.guild.ownerId}> there is a ticket: <#${applicationChannel.id}>`);
  }
})