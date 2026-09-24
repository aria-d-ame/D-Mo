const { Command, CommandType, Argument, ArgumentType } = require ('gcommands');
const { EmbedBuilder } = require('discord.js');
const starSchema = require('../../../schemas/money.js');

// Allows users to bet on a coinflip.
// Adds or deducts money based on whether they win or lose.
new Command({
  name: 'coinflip',
  description: 'Bet your Stars on a coinflip!',
  type: [CommandType.SLASH],
  cooldown: '10s',
  arguments: [
    new Argument({
      name: 'side',
      description: 'Heads or tails?',
      choices: [
        { name: 'Heads', value: 'heads' },
        { name: 'Tails', value: 'tails' }
      ],
      type: ArgumentType.STRING,
      required: true,
    }),
    new Argument({
      name: 'amount',
      description: 'The amount you want to bet!',
      type: ArgumentType.INTEGER,
      required: true,
    })
  ],

  run: async (ctx) => {
    const betAmount = ctx.arguments.getInteger('amount');
    const userId = ctx.user.id;
    const guildId = ctx.guild.id;
    let userStars = await starSchema.findOne({ Guild: guildId, User: userId });
    
    if (betAmount <= 0) {
      return ctx.interaction.reply({ content: 'Please enter a valid amount (Above 0).', 
      ephemeral: true });
    }

    if (!userStars) {
      return ctx.interaction.reply({ content: "You don't have any Pix-Stars yet!", ephemeral: true });
    }

    if (userStars.Money < betAmount) {
      return ctx.interaction.reply({ content:`You don't have enough Pix-Stars to bet! You only have ${userStars.Money}!`, ephemeral: true});
    }

		const choice = [
      `🪙 | ${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} to flip a coin... it's **HEADS**!`,
      `🪙 | ${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} to flip a coin... it's **TAILS**!`,
    ];
    const coin = Math.floor(Math.random() * 2); 
    let outcome = choice[coin];

    const userChoice = ctx.arguments.getString('side'); // 'heads' or 'tails'
    const isWin = (coin === 0 && userChoice === 'heads') || (coin === 1 && userChoice === 'tails');

    if (isWin) {
      userStars.Money += betAmount;
      await userStars.save(); 
      outcome += ` Nice one! You gained ${betAmount}!`;
    } else {
      userStars.Money -= betAmount;
      if (userStars.Money < 0) userStars.Money = 0; 
      await userStars.save(); 
      outcome += ` You're awful at this. You lost ${betAmount}.`;
    }

    const coinEmbed = new EmbedBuilder()
    .setColor(0x8269c2)
    .setTitle(`<:announce:1276188470250832014> 𝙲𝙾𝙸𝙽𝙵𝙻𝙸𝙿 <:announce:1276188470250832014>`)
    .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${outcome}`)

    await ctx.interaction.reply({ embeds: [coinEmbed] });
  }
})
