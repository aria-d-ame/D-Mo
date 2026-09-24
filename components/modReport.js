const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

new Component({
  name: 'modReport',
  type: [ComponentType.BUTTON],

  run: async (ctx) => {
    ctx.reply({ content: `A ticket is being created for you!`, ephemeral: true });
    const role = ctx.guild.roles.cache.get('1269757597301604423');
    const applicationChannel = await ctx.guild.channels.create({
      name: `report-${ctx.user.username}`,
      type: 0, // 0 for text channel
      permissionOverwrites: [
          {
              id: ctx.user.id, 
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory], // Permissions to allow
              deny: [PermissionsBitField.Flags.ManageMessages], // Permissions to deny
          },
          {
            id: role.id, 
            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AttachFiles, PermissionsBitField.Flags.ReadMessageHistory], // Permissions to allow
            deny: [PermissionsBitField.Flags.ManageMessages], // Permissions to deny
          },
          {
              id: ctx.guild.id, // @everyone role ID
              deny: [PermissionsBitField.Flags.ViewChannel], // Deny view channel for everyone by default
          }
      ]
  });

  const reportEmbed = new EmbedBuilder()
    .setAuthor({
      name: ctx.user.username,
      iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 })
    })
    .setColor(0x8269c2)
    .setTitle(`<:xannounce:1276188470250832014> 𝚁𝙴𝙿𝙾𝚁𝚃 <:xannounce:1276188470250832014>`)
    .setDescription(`«════✧ ✦ ✧ ✦ ✧════» 
      <:triangle_small:1276263767872770108> **By submitting your report, you are confirming that everything you say is correct and true.**
      <:triangle_small:1276263767872770108> **To finish your report, answer the questions below!**
      \n<:triangle_small:1276263767872770108> Who are you reporting?
      <:triangle_small:1276263767872770108> What rule are they breaking?
      <:triangle_small:1276263767872770108> Please provide relevant links or screenshots.
      \n<:triangle_small:1276263767872770108> **If you have any questions, feel free to ask!**`)

  await applicationChannel.send({ content: `<@${ctx.user.id}>`, embeds: [reportEmbed] });

  const modChannel = await ctx.guild.channels.fetch('1276650555133136926');
  await modChannel.send(`<@${ctx.guild.ownerId}> <@&1269757597301604423> there is a new report: <#${applicationChannel.id}>`);
  }
})