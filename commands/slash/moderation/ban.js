const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../../schemas/caseSchema.js')

new Command({
  name: 'ban',
  description: 'Moderation: Ban',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'User for ban',
      type: ArgumentType.USER,
      required: true
    }),
    new Argument({
      name: 'reason',
      description: 'Rule broken/reason for ban',
      type: ArgumentType.STRING,
      required: true
    })
  ],

  run: async (ctx) => {
    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const modChannel = await ctx.guild.channels.fetch('1278877530635374675');

    const targetUser = ctx.arguments.getUser('user');
    const banReason = ctx.arguments.getString('reason');

    const member = await ctx.guild.members.fetch(targetUser.id);

    const cases = await caseSchema.findOne({ Guild: targetUser.id });
    const userWarnings = await caseSchema.find({ Guild: ctx.guild.id, User: targetUser.id }).countDocuments() + 1

    await member.kick(banReason);

    const banEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('[ 🔨 ] User Banned')
      .setTimestamp()
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
        { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
        { name: '\n', value: '\n', inline: false },
        { name: '🛑 | Banned:', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: false },
        { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
        { name: `📁 | Case:`, value: `${caseId}`, inline: true },
        { name: `❓ | Reason:`, value: `${banReason}`, inline: false }
      );

  modChannel.send({ embeds: [banEmbed] });

  const banCase = await caseSchema.create({
    Guild: ctx.guild.id,
    User: targetUser.id,
    Warn: userWarnings,
    Type: 'Ban', 
    _id: caseId, 
    Reason: `${banReason}`, 
    Moderator: ctx.user.id, 
    Time: Date.now()
  });

  const notifyEmbed = new EmbedBuilder()
  .setColor('Red')
  .setTitle('[ 🔨 ] You have been banned')
  .addFields(
    { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
    { name: `📁 | Case:`, value: `${caseId}`, inline: true },
    { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
    { name: `❓ | Reason:`, value: `${banReason}`, inline: false }
  )
  .setFooter({
    text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
    iconURL: ctx.guild.iconURL()
  });

  // Send the notification to the muted user, if they share a server
  try {
    await member.send({ embeds: [notifyEmbed] });
  } catch (err) {
    console.log('Could not send message to the muted user:', err);
  }
  }
})