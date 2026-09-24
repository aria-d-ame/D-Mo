const { Command, CommandType } = require('gcommands');
const levelSchema = require('../../../schemas/level.js');
const { PermissionsBitField } = require('discord.js');

new Command({
  name: 'xpreset',
  description: 'Reset XP for the server',
  type: [CommandType.SLASH],
  
  run: async (ctx) => {
    if (!ctx.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await ctx.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
  }

  const { guild } = ctx;

  try {
      // Delete all XP records for the guild
      await levelSchema.deleteMany({ Guild: guild.id });

      // Send a success message
      await ctx.reply({ content: `XP for guild has been reset.` });
  } catch (err) {
      console.error('Error resetting XP:', err);
      await ctx.reply({ content: `There was an error resetting XP. Please try again later.`, ephemeral: true });
  }
  }
})