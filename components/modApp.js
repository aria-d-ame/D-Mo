const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

new Component({
  name: 'modApp',
  type: [ComponentType.BUTTON],

  run: async (ctx) => {
    ctx.reply({ content: `A ticket is being created for you!`, ephemeral: true });
    const applicationChannel = await ctx.guild.channels.create({
      name: `modapp-${ctx.user.username}`,
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

  const modAppEmbed = new EmbedBuilder()
    .setAuthor({
      name: ctx.user.username,
      iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 })
    })
    .setColor(0x8269c2)
    .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙾𝙳 𝙰𝙿𝙿 <:xannounce:1276188470250832014>`)
    .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
      <:triangle_small:1276263767872770108> **Please be aware that you will not be accepted for moderator if you are under the age of 18, or have been in the server for a week or less.** 
      <:triangle_small:1276263767872770108> **By submitting your application, you are confirming that you are over 18 and that you agree to follow all server rules and Discord TOS.**
      <:triangle_small:1276263767872770108> **To finish your application, answer the questions below!**
      \n<:triangle_small:1276263767872770108> Why are you interested in being a moderator?
      <:triangle_small:1276263767872770108> What is your experience with moderation (If you do not have any experience, please state N/A)
      <:triangle_small:1276263767872770108> **Please confirm you have read the rules by answering the following questions:**
      <:triangle_small:1276263767872770108> How many messages at once is considered spam?
      <:triangle_small:1276263767872770108> Do we allow NSFW links, images, etc.? Are there any exceptions?
      <:triangle_small:1276263767872770108> How many warns would cause someone to recieve a ban?
      \n<:triangle_small:1276263767872770108> **If you have any questions, feel free to ask!**`)

  await applicationChannel.send({ content: `<@${ctx.user.id}>`, embeds: [modAppEmbed] });

  const modChannel = await ctx.guild.channels.fetch('1276650555133136926');
  await modChannel.send(`<@${ctx.guild.ownerId}> there is a new mod application: <#${applicationChannel.id}>`);
  }
})