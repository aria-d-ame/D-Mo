const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const levelSchema = require('../../../schemas/level.js');
const { PermissionsBitField } = require('discord.js');

new Command({
  name: 'xpset',
  description: 'Set a users xp.',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'User to set.',
      type: ArgumentType.USER,
      required: true
    }),
    new Argument({
      name: 'amount',
      description: 'The amount to set to.',
      type: ArgumentType.INTEGER,
      required: true
    }),
  ],

  run: async (ctx) => {
  if (!ctx.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await ctx.interaction.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
  }

  const { guild } = ctx;
  const target = ctx.arguments.getUser('user');
  const xp = ctx.arguments.getInteger('amount');

  // Update or create the XP record for the user
  await levelSchema.findOneAndUpdate(
      { Guild: guild.id, User: target.id },
      { XP: xp },
      { upsert: true, new: true } // upsert creates the document if it does not exist
  );

  const tag = target.tag;
  const escapedUsername = tag.replace(/_/g, '\\_');

  // Confirm the XP has been set
  await ctx.interaction.reply({ content: `<:xtriangle_small:1276263767872770108> Set ${xp} XP for ${escapedUsername}.`});
  }
})