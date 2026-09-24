const { Command, CommandType } = require ('gcommands');
const { EmbedBuilder } = require('discord.js');
const starSchema = require('../../../schemas/money.js');
const dailyCooldown = 86400000;

new Command({
  name: 'daily',
  description: 'Claim your daily Pix-Stars!',
  type: [CommandType.SLASH],
  
  run: async (ctx) => {
    const user = ctx.user;
		const member = await ctx.guild.members.fetch(user.id);
    const { guild } = ctx
    const data = await starSchema.findOne({ Guild: guild.id, User: member.id });
    const boosterRole = '1275906991511834688';
    const hasBooterRole = member.roles.cache.has(boosterRole);
    const minGive = 50;
    const maxGive = 250;
    const baseAmount = getRandomInt(minGive, maxGive);
		const currentTime = Date.now();
		const timeSinceLastDaily = currentTime - data.LastDailyTime;

		if (timeSinceLastDaily < dailyCooldown) {
			const expirationTime = data.LastDailyTime + dailyCooldown;
			return ctx.interaction.reply({ content: `You can use this command again <t:${Math.floor(expirationTime / 1000)}:R>!`, ephemeral: true });
		}

  

    function getRandomInt(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Add the base amount to the user's money
    data.Money += baseAmount;

    // If the user has the extra cash role, give an additional bonus
    if (hasBooterRole) {
        const extraCash = 500; // Define how much extra money to give
        data.Money += extraCash;// Add extra money to the total
        const dailyBooster = new EmbedBuilder()
        .setColor(0x8269c2)
        .setTitle(`<:announce:1276188470250832014> 𝙳𝙰𝙸𝙻𝚈 <:announce:1276188470250832014>`)
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n You have claimed your daily for <:xPix_Stars:1275118528844009563>${baseAmount}, and you have recieved an additional <:xPix_Stars:1275118528844009563>500 for boosting! Come back in 24 hours!`)
        await ctx.interaction.reply({ embeds: [dailyBooster] });
    }

    if (!hasBooterRole) {
    const daily = new EmbedBuilder()
    .setColor(0x8269c2)
    .setTitle(`<:announce:1276188470250832014> 𝙳𝙰𝙸𝙻𝚈 <:announce:1276188470250832014>`)
    .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n You have claimed your daily for <:xPix_Stars:1275118528844009563>${baseAmount}! Come back in 24 hours!`)

    await ctx.interaction.reply({ embeds: [daily] });
    }

    data.LastDailyTime = currentTime;
    await data.save();
  }
})