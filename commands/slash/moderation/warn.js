const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../../schemas/caseSchema');
const crypto = require('crypto');

const warningThresholds = {
  dayMute: 2, 
  threeDayMute: 3,
  banAfter: 4, 
};

new Command({
  name: 'warn',
  description: 'Moderation: Warn',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'User to warn',
      type: ArgumentType.USER,
      required: true
    }),
    new Argument({
      name: 'reason',
      description: 'Rule broken/reason for warn',
      type: ArgumentType.STRING,
      required: true
    })
  ],

  run: async (ctx) => {
    const caseId = crypto.randomBytes(3).toString('hex'); // 3 bytes = 6 hex characters
    console.log(caseId); // Outputs a 6-character random string

    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }
    const modChannel = await ctx.guild.channels.fetch('1278877530635374675');

    const targetUser = ctx.arguments.getUser('user');
    const warnReason = ctx.arguments.getString('reason');

    const member = await ctx.guild.members.fetch(targetUser.id);

    const userWarnings = await caseSchema.find({ Guild: ctx.guild.id, User: targetUser.id }).countDocuments() + 1

    const newCase = await caseSchema.create({
      Guild: ctx.guild.id,
      User: targetUser.id,
      Warn: userWarnings,
      Type: 'Warn', 
      _id: caseId, 
      Reason: warnReason, 
      Moderator: ctx.user.id, 
      Time: Date.now()
    });

    const oneWarnEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('[ ⚠️ ] User Warned')
      .setTimestamp()
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
        { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
        { name: '\n', value: '\n', inline: false },
        { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
        { name: `📁 | Case:`, value: `${caseId}`, inline: true },
        { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
        { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
      );

    modChannel.send({ embeds: [oneWarnEmbed] });
    interaction.reply({ content: `User warned.`, ephemeral: true })

    const notifyEmbed = new EmbedBuilder()
    .setColor('Yellow')
    .setTitle('[ ⚠️ ] You have been warned')
    .addFields(
      { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
      { name: `📁 | Case:`, value: `${caseId}`, inline: true },
      { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
      { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
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
    };

    if (userWarnings >= warningThresholds.banAfter) {
      try {
        await member.ban({ reason: `Banned due to ${userWarnings} warnings.` });

        const fourWarnEmbed = new EmbedBuilder()
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
            { name: `❓ | Reason:`, value: `${userWarnings} warns.`, inline: false }
          );
    
        modChannel.send({ embeds: [fourWarnEmbed] });

        const banCase = await caseSchema.create({
          Guild: ctx.guild.id,
          User: targetUser.id,
          Warn: userWarnings,
          Type: 'Ban', 
          _id: caseId, 
          Reason: `Exceeded warn limit.`, 
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
          { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
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

      } catch (err) {
        console.error(err);
        return ctx.reply({ content: "Failed to ban the user.", ephemeral: true });
      }
    } else if (userWarnings >= warningThresholds.threeDayMute) {
      await member.timeout(259200000, warnReason);

      const threeWarnEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('[ 🔇 ] User Muted')
        .setTimestamp()
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
          { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
          { name: '\n', value: '\n', inline: false },
          { name: '⌛ | Time:', value: `<t:${Math.floor((Date.now() + 259200000) / 1000 )}:R>`, inline: false },
          { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
          { name: `📁 | Case:`, value: `${caseId}`, inline: true },
          { name: `❓ | Reason:`, value: `${userWarnings} warns.`, inline: false }
        );
  
      modChannel.send({ embeds: [threeWarnEmbed] });

      const muteCase = await caseSchema.create({
        Guild: ctx.guild.id,
        User: targetUser.id,
        Warn: userWarnings,
        Type: 'Mute', 
        _id: caseId, 
        Reason: `Exceeded warn limit.`, 
        Moderator: ctx.user.id, 
        Time: Date.now()
      });

      const notifyEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('[ 🔇 ] You have been muted')
      .addFields(
        { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
        { name: `📁 | Case:`, value: `${caseId}`, inline: true },
        { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
        { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
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

    } else if (userWarnings >= warningThresholds.dayMute) {
      await member.timeout(86400000, warnReason);

      const twoWarnEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('[ 🔇 ] User Muted')
        .setTimestamp()
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
          { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
          { name: '\n', value: '\n', inline: false },
          { name: '⌛ | Time:', value: `<t:${Math.floor((Date.now() + 86400000) / 1000 )}:R>`, inline: false },
          { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
          { name: `📁 | Case:`, value: `${caseId}`, inline: true },
          { name: `❓ | Reason:`, value: `${userWarnings} warns.`, inline: false }
        );
  
      modChannel.send({ embeds: [twoWarnEmbed] });

      const muteCase = await caseSchema.create({
        Guild: ctx.guild.id,
        User: targetUser.id,
        Warn: userWarnings,
        Type: 'Mute', 
        _id: caseId, 
        Reason: `Exceeded warn limit.`, 
        Moderator: ctx.user.id, 
        Time: Date.now()
      });

      const notifyEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('[ 🔇 ] You have been muted')
      .addFields(
        { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
        { name: `📁 | Case:`, value: `${caseId}`, inline: true },
        { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
        { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
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
  }
}); 