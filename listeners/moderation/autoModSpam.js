const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../schemas/caseSchema'); 
const crypto = require('crypto');

const spamThreshold = 6;
const timeWindow = 5000;
const warningCooldown = 300000; // 5 minutes in milliseconds

const warningThresholds = {
  dayMute: 2, 
  threeDayMute: 3,
  banAfter: 4,
};

let userMessageTimes = new Map(); // To store user messages and timestamps
let userCooldowns = new Map(); // To track cooldowns for warnings

new Listener({
  name: 'Auto Moderation: Spam',
  event: 'messageCreate',

  run: async (ctx) => {
    if (ctx.author.bot) return;

    const targetUser = ctx.author;
    const currentTime = Date.now();

    // Retrieve the list of message timestamps for the user
    const messageTimes = userMessageTimes.get(targetUser.id) || [];

    // Add the current message timestamp to the user's record
    messageTimes.push(currentTime);

    // Remove timestamps that are outside the time window (spam detection period)
    while (messageTimes.length > 0 && messageTimes[0] < currentTime - timeWindow) {
      messageTimes.shift(); // Remove the oldest timestamp
    }

    // Update the user's message timestamps
    userMessageTimes.set(targetUser.id, messageTimes);

    // Check if the user has sent too many messages within the time window
    if (messageTimes.length >= spamThreshold) {
      // Check if the user has already been warned recently
      const lastWarningTime = userCooldowns.get(targetUser.id);
      if (lastWarningTime && currentTime - lastWarningTime < warningCooldown) {
        // If within the cooldown period, do not warn again
        return;
      }

      // Delete the user's last message (or any other spam messages as necessary)
      await ctx.delete();

      // Generate a case ID for this moderation action
      const caseId = crypto.randomBytes(3).toString('hex');
      const warnReason = 'Automod Rule 2: Detected spam (too many messages in a short time frame)';

      // Get current warning count from the database
      let userWarnings = await caseSchema.find({ Guild: ctx.guild.id, User: targetUser.id }).countDocuments() + 1;

      // Log this warning in the database
      await caseSchema.create({
        Guild: ctx.guild.id,
        User: targetUser.id,
        Warn: userWarnings,
        Type: 'Warn',
        _id: caseId,
        Reason: warnReason,
        Moderator: '1282026688011829270',
        Time: Date.now(),
      });

      // Send embed to mod channel about the warning
      const warningEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('[ ⚠️ ] User Warned')
        .setTimestamp()
        .setThumbnail(targetUser.displayAvatarURL())
        .addFields(
          { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
          { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
          { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
          { name: `📁 | Case:`, value: `${caseId}`, inline: true },
          { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
          { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
        );

      const modChannel = await ctx.guild.channels.fetch('1278877530635374675');
      modChannel.send({ embeds: [warningEmbed] });

      // Notify the user that they've been warned
      const notifyEmbed = new EmbedBuilder()
        .setColor('Yellow')
        .setTitle('[ ⚠️ ] You have been warned')
        .addFields(
          { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
          { name: `📁 | Case:`, value: `${caseId}`, inline: true },
          { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
          { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
        )
        .setFooter({
          text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
          iconURL: ctx.guild.iconURL(),
        });

      try {
        await targetUser.send({ embeds: [notifyEmbed] });
      } catch (err) {
        console.log('Could not send message to the warned user:', err);
      }

      // Update the cooldown timestamp
      userCooldowns.set(targetUser.id, currentTime);

      // Take action based on the user's warning count
      const member = await ctx.guild.members.fetch(targetUser.id);

      // Handle ban, mute actions based on the warning count
      if (userWarnings >= warningThresholds.banAfter) {
        // Ban the user if they have too many warnings
        try {
          await member.ban({ reason: `Banned after ${userWarnings} warnings` });

          const banEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('[ 🔨 ] User Banned')
            .setTimestamp()
            .setThumbnail(targetUser.displayAvatarURL())
            .addFields(
              { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
              { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
              { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
              { name: `📁 | Case:`, value: `${caseId}`, inline: true },
              { name: `❓ | Reason:`, value: `Exceeded warning threshold`, inline: false }
            );

          modChannel.send({ embeds: [banEmbed] });

          await caseSchema.create({
            Guild: ctx.guild.id,
            User: targetUser.id,
            Warn: userWarnings,
            Type: 'Ban',
            _id: caseId,
            Reason: 'Exceeded warn limit.',
            Moderator: '1282026688011829270',
            Time: Date.now(),
          });

          const notifyEmbed = new EmbedBuilder()
            .setColor('Red')
            .setTitle('[ 🔨 ] You have been banned')
            .addFields(
              { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
              { name: `📁 | Case:`, value: `${caseId}`, inline: true },
              { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
              { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
            )
            .setFooter({
              text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
              iconURL: ctx.guild.iconURL()
            });

          try {
            await member.send({ embeds: [notifyEmbed] });
          } catch (err) {
            console.log('Could not send message to the muted user:', err);
          }

        } catch (err) {
          console.error('Failed to ban user:', err);
          return ctx.reply({ content: "Failed to ban the user.", ephemeral: true });
        }

      } else if (userWarnings >= warningThresholds.threeDayMute) {
        // Mute the user for 3 days if they exceed this threshold
        await member.timeout(259200000, 'Excessive warnings');

        const muteEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('[ 🔇 ] User Muted')
          .setTimestamp()
          .setThumbnail(targetUser.displayAvatarURL())
          .addFields(
            { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
            { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
            { name: '⌛ | Time:', value: `<t:${Math.floor((Date.now() + 259200000) / 1000)}:R>`, inline: false },
            { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
            { name: `📁 | Case:`, value: `${caseId}`, inline: true },
            { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
          );

        modChannel.send({ embeds: [muteEmbed] });

        await caseSchema.create({
          Guild: ctx.guild.id,
          User: targetUser.id,
          Warn: userWarnings,
          Type: 'Mute',
          _id: caseId,
          Reason: 'Exceeded warn limit.',
          Moderator: '1282026688011829270',
          Time: Date.now(),
        });

        const notifyEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('[ 🔇 ] You have been muted')
          .addFields(
            { name: `🛡️ | Moderator:`, value: `<@1282026688011829270>`, inline: true },
            { name: `📁 | Case:`, value: `${caseId}`, inline: true },
            { name: `⚠️ | Warns:`, value: `${userWarnings}`, inline: true },
            { name: `❓ | Reason:`, value: `${warnReason}`, inline: false }
          )
          .setFooter({
            text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
            iconURL: ctx.guild.iconURL()
          });

        try {
          await member.send({ embeds: [notifyEmbed] });
        } catch (err) {
          console.log('Could not send message to the muted user:', err);
        }
      }

      return;
    }
  }
});
