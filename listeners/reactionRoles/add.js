const { Listener } = require('gcommands');
const { reactionRoles } = require('../../config.json');

new Listener({
  name: 'Red Reaction Roles Add',
  event: 'messageReactionAdd',

  /**
   * Assigns a role to a user who adds a reaction to the given message.
   * @param {Object} ctx - The context of the event.
   * @param {Object} reactor - The user who added the reaction.
   */
  run: async (ctx, reactor) => {
    // Check if the message id exists in the messageIds array
    const reactRoleEntry = reactionRoles.find(item => item.messageId === ctx.message.id);
    if (!reactRoleEntry) return;

    // The role ID of the roles to assign and the emoji linked to them.
    const roleEmojis = reactRoleEntry.roleEmojis;

    // Get the role from the array of roleEmojis that matches the emoji of the reaction.
    const reactRole = roleEmojis.find(item => item.emoji === ctx.emoji.name);
    if (!reactRole) return;

    // Try to assign the role to the user who reacted.
    try {
      // Get the member who reacted (user who added the reaction)
      const member = await ctx.message.guild.members.fetch(reactor.id);

      // Get the role from the guild
      const role = await ctx.message.guild.roles.fetch(reactRole.roleId);

      // Check if the member already has the role
      if (!member.roles.cache.has(reactRole.roleId)) {
        await member.roles.add(role);
        console.log(`Assigned ${role.name} to ${member.user.tag}`);
      } else {
        console.log(`${member.user.tag} already has the role.`);
      }

    } catch (err) {
      console.error('Error assigning role:', err);
    }
  }
});
