const { Command, CommandType, Argument, ArgumentType } = require ('gcommands');
const { EmbedBuilder } = require('discord.js');
const moneySchema = require('../../../schemas/money.js');

new Command({
  name: 'give',
  description: 'Give a user Pix-Stars',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Who do you want to give to?',
      type: ArgumentType.USER,
      required: true,
    }),
    new Argument({
      name: 'amount',
      description: 'The amount you want to give.',
      type: ArgumentType.INTEGER,
      required: true,
    })
  ],

  run: async (ctx) => {
    const { guild } = ctx;
    const target = ctx.options.getUser('user');
    const stars = ctx.options.getInteger('amount');
    const member = await ctx.guild.members.fetch(target.id);
    const giver = await ctx.guild.members.fetch(ctx.user.id);

    const giverData = await moneySchema.findOne({ Guild: guild.id, User: giver.id });
    const targetData = await moneySchema.findOne({ Guild: guild.id, User: member.id });
    
    if (!giverData) {
        return interaction.reply({ content: "You don't have anything to give!", ephemeral: true });
    }

    // Debugging logs
    console.log(`Giver Balance Before: ${giverData.Money}`);
    
    if (giverData.Money < stars) {
        return ctx.interaction.reply({ content: "You don't have enough Pix-Stars!", ephemeral: true });
    }

    // Deduct stars from giver
    giverData.Money -= stars;
    await giverData.save();

    // Add stars to target
    if (!targetData) {
        const newTargetData = new moneySchema({ Guild: guild.id, User: member.id, balance: stars });
        await newTargetData.save();
    } else {
        targetData.Money += stars;
        await targetData.save();
    }

    // Debugging logs
    console.log(`Giver Balance After: ${giverData.Money}`);
    if (targetData) {
        console.log(`Target Balance After: ${targetData.Money}`);
    }

    // Create and send the embed
    const giveEmbed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setTitle(`<:announce:1276188470250832014> 𝙶𝙸𝚅𝙴 <:announce:1276188470250832014>`)
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n Successfully gave <:xPix_Stars:1275118528844009563> ${stars} to ${target.tag}!`);

    await ctx.interaction.reply({ embeds: [giveEmbed] });
  }
})