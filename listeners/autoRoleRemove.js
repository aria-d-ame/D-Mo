// const { Listener } = require('gcommands');

// new Listener({
//   name: 'Role Connection Remove',
//   event: 'guildMemberUpdate',

//   run: async (ctx) => {
//     try {
//       // Fetch the member object for the user who triggered the context
//       const member = await ctx.guild.members.fetch(ctx.user.id);
//       const guild = ctx.guild;
  
//       const pingsRole = await guild.roles.cache.get('1281722400253411338');
//       if (!member.roles.cache.has(pingsRole.id)) {
//         return console.log(`Role update: User does not have the 'pings' role.`);
//       }
//       const logChannel = await guild.channels.fetch('1278877530635374675'); // Channel to send log messages
  
//       const pingsTriggerRoles = [
//         await guild.roles.cache.get('1269842766385381448'), // Announcement role
//         await guild.roles.cache.get('1269842839479521422'), // Birthday role
//         await guild.roles.cache.get('1269843357387980851'), // Chat Revive role
//         await guild.roles.cache.get('1273042447219556454'), // General Event role
//         await guild.roles.cache.get('1269843478595239936'), // Art Event role
//         await guild.roles.cache.get('1269843429878140999'), // Game Event role
//         await guild.roles.cache.get('1272640682200268810'), // Poll role
//         await guild.roles.cache.get('1270212130204811376'), // Welcome role
//         await guild.roles.cache.get('1279272272087220276'), // Bump role
//         await guild.roles.cache.get('1281734946247016578'), // QOTD (Question of the Day) role
//         await guild.roles.cache.get('1295208277873000448'), // Bot role
//       ];
  
//       // Check if the member has any of the roles that should trigger 'aboutRole' or 'pingsRole'
//       const hasPingsTriggerRole = pingsTriggerRoles.some((role) => member.roles.cache.has(role.id));

//       if (hasPingsTriggerRole) {
//         return console.log(`User ${ctx.user.username} does not meet criteria.`);
//       }
  
//       // If the member no longer has any 'pingsRole' trigger roles, remove the 'pingsRole'
//       if (!hasPingsTriggerRole) {
//         await member.roles.remove(pingsRole);
//         await logChannel.send(`Automatic 'pings' role removed from ${member.user.tag}.`);
//       }
  
//     } catch (error) {
//       // Log any errors that occur during the execution
//       console.error(error);
//     }
//   }
// })