const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const countingSchema = require('../../../schemas/countingSchema.js');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');


new Command({
  name: 'counting',
  description: 'Manage counting!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'type',
      description: 'Setup or disable?',
      type: ArgumentType.STRING,
      choices: [
        { name: 'Set up', value: 'setup' },
        { name: 'Disable', value: 'Disable' },
      ],
      required: true
    }),
    new Argument({
      name: 'channel',
      description: 'Channel',
      type: ArgumentType.CHANNEL,
      required: true
    })
  ],

  run: async (ctx) => {
    const { options } = ctx;
    const sub = ctx.arguments.getString('type');
    const data = await countingSchema.findOne({ Guild: ctx.guild.id});

    if (!ctx.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `You don't have permissions to manage counting!`, flags: 64 })

    switch (sub) {
      case 'setup':

      if (data) {
        return await ctx.reply({ content: 'Counting has already been set up!', flags: 64})
      } else {
        const channel = ctx.arguments.getChannel('channel');
        await countingSchema.create({
          Guild: ctx.guild.id,
          Channel: channel.id,
          Number: 1
        });
        const embed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setDescription(`Counting has been set up! Start counting in ${channel}!`)

        await ctx.reply({ embeds: [embed] });
      }

      break;
      case 'disable':
        
      if (!data) {
        return await ctx.reply({ content: `You don't have counting set up!` })
      } else {
        await countingSchema.deleteOne({
          Guild: ctx.guild.id,
        });

        const embed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setDescription(`Counting disabled!`)

        await ctx.reply({ embeds: [embed] });
      }
    }
  }
})