const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

new Component({
  name: 'partner',
  type: [ComponentType.BUTTON],

  run: async (ctx) => {
    ctx.reply({ content: `A ticket is being created for you!`, ephemeral: true });
    const applicationChannel = await ctx.guild.channels.create({
      name: `partner-${ctx.user.username}`,
      type: 0, // 0 for text channel
      permissionOverwrites: [
          {
              id: ctx.user.id, 
              allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory], // Permissions to allow
              deny: [PermissionsBitField.Flags.ManageMessages], // Permissions to deny
          },
          {
              id: ctx.guild.id, // @everyone role ID
              deny: [PermissionsBitField.Flags.ViewChannel], // Deny view channel for everyone by default
          }
      ]
  });

  const partnerEmbed = new EmbedBuilder()
    .setAuthor({
      name: ctx.user.username,
      iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 })
    })
    .setColor(0x8269c2)
    .setTitle(`<:xannounce:1276188470250832014> 𝙿𝙰𝚁𝚃𝙽𝙴𝚁 𝙰𝙿𝙿 <:xannounce:1276188470250832014>`)
    .setDescription(`«════✧ ✦ ✧ ✦ ✧════» 
      <:triangle_small:1276263767872770108> **By submitting your application, you are confirming that your server follows all partnership <#1283931220887076874> and Discord's TOS.**
      <:triangle_small:1276263767872770108> **To finish your application, answer the questions below!**
      \n<:triangle_small:1276263767872770108> Does your server have an age requirment?
      <:triangle_small:1276263767872770108> Is your server SFW or NSFW?
      <:triangle_small:1276263767872770108> Please include the link to your server.
      \n<:triangle_small:1276263767872770108> **If you have any questions, feel free to ask!**`)

  await applicationChannel.send({ content: `<@${ctx.user.id}>`, embeds: [partnerEmbed] });

  const modChannel = await ctx.guild.channels.fetch('1276650555133136926');
  await modChannel.send(`<@${ctx.guild.ownerId}> there is a new partner application: <#${applicationChannel.id}>`);
  }
})