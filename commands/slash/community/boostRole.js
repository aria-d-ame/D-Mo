const { Command, ArgumentType, Argument, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const boostRoles = require('../../../schemas/boostRoles.js');

// Command to edit the color and name of a user's custom role for boosting.
// Automatically creates and saves role ID in boostRoles DB.
new Command({
  name: 'boostrole-edit',
  description: 'Make or edit your custom booster role!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'color',
      description: 'Pick your color!',
      type: ArgumentType.STRING,
      required: false
    }),
    new Argument({
      name: 'name',
      description: 'Pick your name!',
      type: ArgumentType.STRING,
      required: false
    })
  ],
  
  run: async (ctx) => {
    const { guild } = ctx
    //The ID for Discord's automatic Booster role.
    const boosterRole = ['1275906991511834688'];
    const user = ctx.user;

    const colorChange = ctx.arguments.getString('color');
    const nameChange = ctx.arguments.getString('name');
    await ctx.interaction.deferReply({ ephemeral: true });

    //Figure out if interaction.user has the Booster role.
    const member = await guild.members.fetch(ctx.user.id);
    const isBooster = member.roles.cache.some(role => boosterRole.includes(role.id));

    //Deny interaction is user does not have Booster role.
    if (!isBooster) {
      return ctx.interaction.editReply({ content: 'You are not a Booster!', ephemeral: true });
    }

    const boostRoleId = await boostRoles.findOne({ Guild: guild.id, User: member.id });
    if (!boostRoleId) {
      //Create and save the ID for the Booster Role.
      ctx.interaction.editReply({ content: 'Your custom booster role has been created!'});
    }

    let boostRoleData = await boostRoles.findOne({ Guild: guild.id, User: member.id });
    let role;

    if (!boostRoleData) {
      // Create a new custom role
      role = await guild.roles.create({
        name: `${user.username}'s Booster Role`,
        color: '#FFFFFF', // Default color (white)
        reason: 'Custom booster role created for user.'
      });

      // Save the role ID in the database
      const newBoostRole = new boostRoles({
        Guild: guild.id,
        User: member.id,
        RoleID: role.id
      });
      await newBoostRole.save();
      await ctx.interaction.editReply({ content: 'Your custom booster role has been created!', ephemeral: true });
      await member.roles.add(role);
    } else {
      role = await guild.roles.fetch(boostRoleData.RoleID);
    };

    //Determine if they are chaging the color or the name of the role

    function isValidHexColor(colorCode) {
      return typeof colorCode === 'string' 
      && colorCode.length === 7 
      && colorCode[0] === '#' 
    }

    try {
      // Apply color change
      if (colorChange) {
        if (!isValidHexColor(colorChange)) {
          return ctx.interaction.editReply({ content: 'Please use a valid hex code! (#RRGGBB).' });
        }
        await role.setColor(colorChange);
      }
 
      // Apply name change
      if (nameChange) {
        await role.setName(nameChange);
      }
 
      await ctx.interaction.editReply({ content: 'Your booster role has been updated!' });
    } catch (error) {
      console.error('Error updating booster role:', error);
      await ctx.interaction.editReply({ content: 'There was an error updating your booster role. Please try again later.' });
    }
  }
})