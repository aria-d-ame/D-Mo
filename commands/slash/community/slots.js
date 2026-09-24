const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const starSchema = require('../../../schemas/money.js');

new Command({
  name: 'slots',
  description: 'Gamble your Stars on slots!',
  type: [CommandType.SLASH],
  cooldown: '10s',
  arguments: [
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
    let userMoney = await starSchema.findOne({ Guild: guildId, User: userId });
    const moneyAmount = betAmount * 2

    if (betAmount <= 0) {
      return ctx.interaction.reply({ content: 'Please enter a valid amount (Above 0).', 
      ephemeral: true });
    }
  

    if (!userMoney) {
      return ctx.interaction.reply({ content: "You don't have any Pix-Stars yet!", ephemeral: true });
    }

    if (userMoney.Money < betAmount) {
      return ctx.interaction.reply({ content:`You don't have enough Pix-Stars to bet! You only have ${userMoney.Money}!`, ephemeral: true});
    }

    const items = [':cloud:', ':sparkles:', ':purple_heart:'];   

    const results = [items[Math.floor(Math.random() * items.length)], items[Math.floor(Math.random() * items.length)], items[Math.floor(Math.random() * items.length)]];

    const initialEmbed = new EmbedBuilder()
      .setTitle("𝚂𝙻𝙾𝚃𝚂")
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n🔄|${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} on slots...\n\n• 🔄  🔄  🔄 •`) 
      .setColor(0x8269c2);

    const spinnerMessage = await ctx.interaction.reply({ embeds: [initialEmbed], fetchReply: true });

    setTimeout(() => {
      const firstEmbed = new EmbedBuilder()
        .setTitle("𝚂𝙻𝙾𝚃𝚂")
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n🔄|${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} on slots...\n\n• ${results[0]}  🔄  🔄 •`)
        .setColor(0x8269c2);
      spinnerMessage.edit({ embeds: [firstEmbed] });
    }, 600);
 
    setTimeout(() => {
      const secondEmbed = new EmbedBuilder()
        .setTitle("𝚂𝙻𝙾𝚃𝚂")
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n🔄|${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} on slots...\n\n• ${results[0]}  ${results[1]}  🔄 •`)
        .setColor(0x8269c2);
      spinnerMessage.edit({ embeds: [secondEmbed] });
    }, 1200);
 
    setTimeout(async () => {
      const finalEmbed = new EmbedBuilder()
        .setTitle("𝚂𝙻𝙾𝚃𝚂")
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n🔄|${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} on slots...\n\n• ${results.join('  ')} •`)
        .setColor(0x8269c2);

      let outcome;
      if (results[0] === results[1] && results[1] === results[2]) {
        userMoney.Money += moneyAmount;
        outcome = `Impressive! You won <:xPix_Stars:1275118528844009563>${moneyAmount}`;
      } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
        userMoney.Money -= moneyAmount;
        outcome = `Better luck next time! You lost <:xPix_Stars:1275118528844009563>${moneyAmount}`;
        if (userMoney.Money < 0) userMoney.Money = 0;
      } else {
        userMoney.Money -= moneyAmount;
        outcome = `Better luck next time! You lost <:xPix_Stars:1275118528844009563>${moneyAmount}`;
        if (userMoney.Money < 0) userMoney.Money = 0;
      }

      await userMoney.save();
      finalEmbed.setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n🔄|${ctx.user} bets <:xPix_Stars:1275118528844009563>${betAmount} on slots...\n\n• ${results.join('  ')} •\n\n${outcome}`);
      await spinnerMessage.edit({ embeds: [finalEmbed] });

    }, 1800);
  }
})