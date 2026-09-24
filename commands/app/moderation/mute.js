// const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
// const { EmbedBuilder } = require('discord.js');
// const caseSchema = require('../../../schemas/caseSchema.js')

// new Command({
//   name: 'Mute User',
//   description: 'Moderation: Mute',
//   type: [CommandType.CONTEXT_USER],
//   arguments: [
//     new Argument({
//       name: 'user',
//       description: 'User for mute',
//       type: ArgumentType.USER,
//       required: true
//     }),
//     new Argument({
//       name: 'time',
//       description: 'Time for mute (minutes)',
//       type: ArgumentType.INTEGER,
//       required: true
//     }),
//     new Argument({
//       name: 'reason',
//       description: 'Rule broken/reason for mute',
//       type: ArgumentType.STRING,
//       required: true
//     })
//   ],

//   run: async (ctx) => {
//     const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
//     if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
//       return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
//     }

//     const modChannel = await ctx.guild.channels.fetch('1278877530635374675');

//     const targetUser = ctx.arguments.getUser('user');
//     const muteTime = ctx.arguments.getInteger('time') * 60 * 1000;
//     const muteReason = ctx.arguments.getString('reason');

//     const member = await ctx.guild.members.fetch(targetUser.id);

//     const cases = await caseSchema.findOne({ Guild: targetUser.id });

//     await member.timeout(muteTime, muteReason);

//     const muteEmbed = new EmbedBuilder()
//     .setColor('Red')
//     .setTitle('[ 🔇 ] User Muted')
//     .setTimestamp()
//     .setThumbnail(targetUser.displayAvatarURL())
//     .setFooter({
//       text: `${ctx.guild.memberCount} Members`,
//       iconURL: ctx.guild.iconURL()
//     })
//     .addFields(
//       { name: '👤 | User:', value: `<@${targetUser.id}> (${targetUser.username})`, inline: false },
//       { name: '🪪 | ID:', value: `${targetUser.id}`, inline: false },
//       { name: '\n', value: '\n', inline: false },
//       { name: '⌛ | Time:', value: `<t:${Math.floor((Date.now() + muteTime) / 1000 )}:R>`, inline: false },
//       { name: `🛡️ | Moderator:`, value: `<@${ctx.user.id}>`, inline: true },
//       { name: `📁 | Case:`, value: `${caseId}`, inline: true },
//       { name: `❓ | Reason:`, value: `${muteReason}`, inline: false }
//     );

//   modChannel.send({ embeds: [muteEmbed] });

//   const muteCase = await caseSchema.create({
//     Guild: ctx.guild.id,
//     User: targetUser.id,
//     Warn: userWarnings,
//     Type: 'Mute', 
//     _id: caseId, 
//     Reason: `${muteReason}`, 
//     Moderator: ctx.user.id, 
//     Time: Date.now()
//   });

//   const notifyEmbed = new EmbedBuilder()
//   .setColor('RED')
//   .setDescription(`You have been muted for ${ctx.arguments.getInteger('time')} minutes. Reason: ${muteReason}`);

//   // Send the notification to the muted user, if they share a server
//   try {
//     await member.send({ embeds: [notifyEmbed] });
//   } catch (err) {
//     console.log('Could not send message to the muted user:', err);
//     }
//   }
// })