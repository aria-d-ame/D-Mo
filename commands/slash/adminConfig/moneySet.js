const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { PermissionsBitField } = require('discord.js');

new Command({
  name: 'moneyset',
  description: 'Set money for a server member.',
  type: [CommandType.SLASH],

  run: async (ctx) => {
    if (!ctx.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return await ctx.reply({ content: `You don't have permissions to manage XP!`, ephemeral: true });
  }

  const { guild } = ctx;
  const target = ctx.arguments.getUser('user');
  const money = ctx.arguments.getInteger('money');

  // Update or create the XP record for the user
  await moneySchema.findOneAndUpdate(
      { Guild: guild.id, User: target.id },
      { Money: money },
      { upsert: true, new: true } // upsert creates the document if it does not exist
  );

  const tag = target.tag;
  const escapedUsername = tag.replace(/_/g, '\\_');

  // Confirm the XP has been set
  await ctx.reply({ content: `<:xtriangle_small:1276263767872770108> Set ${money} Pix-Stars for ${escapedUsername}.`});
  }
})