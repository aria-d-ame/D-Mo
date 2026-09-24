const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const starSchema = require('../../../schemas/money.js');

new Command({
  name: 'steal',
  description: 'Steal Pix-Stars from someone!',
  cooldown: '1200s',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Member to steal from!',
      type: ArgumentType.USER,
      required: true
    }),
  ],

  run: async (ctx) => {
    const { guild } = ctx;
    const target = ctx.arguments.getUser('user');
    const member = await ctx.guild.members.fetch(target.id);
    const stealer = await ctx.guild.members.fetch(ctx.user.id);
    const minSteal = 10;
    const maxSteal = 700;
    const stealAmount = getRandomInt(minSteal, maxSteal);
    

    function getRandomInt(min, max) {
       return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const stealerData = await starSchema.findOne({ Guild: guild.id, User: stealer.id });
    const targetData = await starSchema.findOne({ Guild: guild.id, User: member.id });
    
    if (!targetData) {
        return ctx.interaction.reply({ content: "There's nothing to steal!", ephemeral: true });
    }

    // Debugging logs
    console.log(`Stealer Balance Before: ${stealerData.Money}`);
    
    if (targetData.Money < stealAmount) {
        return ctx.interaction.reply({ content: "There's not enough to steal!", ephemeral: true });
    }

    // Deduct stars from giver
    stealerData.Money += stealAmount;
    await stealerData.save();

    // Add stars to target
    if (!stealerData) {
        const newStealerData = new moneySchema({ Guild: guild.id, User: member.id, balance: stealAmount });
        await newStealerData.save();
    } else {
        targetData.Money -= stealAmount;
        await targetData.save();
    }

    // Debugging logs
    console.log(`Stealer Balance After: ${stealerData.Money}`);
    if (targetData) {
        console.log(`Target Balance After: ${targetData.Money}`);
    }

    // Create and send the embed
    const stealEmbed = new EmbedBuilder()
        .setColor(0x8269c2)
        .setTitle(`<:announce:1276188470250832014> 𝚂𝚃𝙴𝙰𝙻 <:announce:1276188470250832014>`)
        .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n Successfully stole <:xPix_Stars:1275118528844009563> ${stealAmount} from ${target.tag}!`);

    await ctx.interaction.reply({ embeds: [stealEmbed] });
  }
})