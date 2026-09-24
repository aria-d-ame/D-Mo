const { Command, CommandType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, } = require('discord.js');
const moneySchema = require('../../../schemas/money.js');


const shopButtons = (customId, label, emojiId) => {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary)
    .setEmoji(emojiId)

  return button;
}

const shopEmbeds = (ctx, title, description, fields) => {
  const embed = new EmbedBuilder()
    .setColor(0x8269c2)
    .setThumbnail('https://i.ibb.co/5K7Qnwf/image-15-scaled-16x-pngcrushed-1.png')
    .setTitle(`<:announce:1276188470250832014> ${title} <:announce:1276188470250832014>`)
    .setDescription(
      '**«═══✧ ✦ ✧ ✦ ✧═══»**\n\n' +
      description
    )
    .setFooter({
      text: `${ctx.guild.name}`,
      iconURL: ctx.guild.iconURL()
    })

  if (fields) {
    embed.addFields(fields);
  }

  return embed;
}

new Command({
  name: 'shop',
  description: 'Check out the server shop!',
  type: [CommandType.SLASH],

  run: async (ctx) => {
    const { guild } = ctx;
    const user = await ctx.guild.members.fetch(ctx.user.id);
    const moneyData = await moneySchema.findOne({ Guild: guild.id, User: user.id });
    console.log(moneyData);

    if (!moneyData) {
      return ctx.reply({ content: "You have nothing to spend!", ephemeral: true });
    }

    const returnButton = shopButtons('returnButton', 'Return', '1276188176238645300');
    const buyButton = shopButtons('buyButton', 'Buy', '1275118528844009563')
    const millButton = shopButtons('millButton', 'Millionaire', '1275118643637915722');
    const billButton = shopButtons('billButton', 'Billionaire', '1275118681902546987');
    const poorButton = shopButtons('poorButton', 'I\'m poor', '1276188176238645300');
    const xpBoost = shopButtons('xpBoost', 'XP Boost', '1275118499793998006');
    const starBoost = shopButtons('starBoost', 'Stars Boost', '1275118528844009563');

    const mainMenuButtons = new ActionRowBuilder()
      .addComponents(millButton, billButton, poorButton, xpBoost, starBoost);
    const buyMenuButtons = new ActionRowBuilder()
      .addComponents(buyButton, returnButton);

    const shopEmbed = shopEmbeds(ctx, '𝚂𝚃𝙰𝚁𝚂 𝚂𝙷𝙾𝙿',
      '<:xtriangle_large:1276185605268832277> **Welcome to Adeptus Aria\'s shop!**',
      [{ name: 'Millionaire', value: '<:xPix_Stars:1275118528844009563>1,000,000', inline: true },
      { name: 'Billionaire', value: '<:xPix_Stars:1275118528844009563>1,000,000,000', inline: true },
      { name: 'I\'m poor', value: '<:xPix_Stars:1275118528844009563>1', inline: true },
      { name: 'XP Boost', value: '<:xPix_Stars:1275118528844009563>20,000,', inline: true },
      { name: 'Stars Boost', value: '<:xPix_Stars:1275118528844009563>50,000', inline: true }],
    )

    const millEmbed = shopEmbeds(ctx, '𝙼𝙸𝙻𝙻𝙸𝙾𝙽𝙰𝙸𝚁𝙴',
      '<:xtriangle_large:1276185605268832277> **Buying this will give you the <:xmill_role:1275118643637915722>Millionaire Role!**\n' +
      '<:xtriangle_small:1276263767872770108> Cost: <:xPix_Stars:1275118528844009563>1,000,000\n' +
      '<:xtriangle_small:1276263767872770108> Purely Cosmetic, placed above all leveled roles.\n\n' +
      '**Use the buttons below to buy!**\n' +
      '...or return to the shop!'
    )

    const billEmbed = shopEmbeds(ctx, '𝙱𝙸𝙻𝙻𝙸𝙾𝙽𝙰𝙸𝚁𝙴',
      '<:xtriangle_large:1276185605268832277> **Buying this will give you the <:xbill_role:1275118681902546987>Billionaire Role!**\n' +
      '<:xtriangle_small:1276263767872770108> Cost: <:xPix_Stars:1275118528844009563>1,000,000,000\n' +
      '<:xtriangle_small:1276263767872770108> Purely Cosmetic, placed above all leveled roles.\n\n' +
      '**Use the buttons below to buy!**\n' +
      '...or return to the shop!'
    )

    const xpboostEmbed = shopEmbeds(ctx, '𝚇𝙿 𝙱𝙾𝙾𝚂𝚃',
      '<:xtriangle_large:1276185605268832277> **Buying this will give you a temporary XP Boost of 10<:xXP:1275118499793998006> per message!**\n' +
      '<:xtriangle_small:1276263767872770108> Cost: <:xPix_Stars:1275118528844009563>20,000\n' +
      '<:xtriangle_small:1276263767872770108> Time: 6 Hours\n\n' +
      '**Use the buttons below to buy!**\n' +
      '...or return to the shop!'
    )

    const starboostEmbed = shopEmbeds(ctx, '𝚂𝚃𝙰𝚁𝚂 𝙱𝙾𝙾𝚂𝚃',
      '<:xtriangle_large:1276185605268832277> Buying this will give you a temporary Stars Boost of 10<:xPix_Stars:1275118528844009563> per message!\n' +
      '<:xtriangle_small:1276263767872770108> Cost: <:xPix_Stars:1275118528844009563>50,000\n' +
      '<:xtriangle_small:1276263767872770108> Time: 6 Hours\n\n' +
      '**Use the buttons below to buy!**\n' +
      '...or return to the shop!'
    )

    const poorEmbed = shopEmbeds(ctx, '𝙿𝙾𝙾𝚁 𝚁𝙾𝙻𝙴',
      '<:xtriangle_large:1276185605268832277> Buying this will give you the Homeless role!\n' +
      '<:xtriangle_small:1276263767872770108> Cost: <:xPix_Stars:1275118528844009563>1\n' +
      '<:xtriangle_small:1276263767872770108> Purely cosmetic, placed below all other roles.\n\n' +
      '**Use the buttons below to buy!**\n' +
      '...or return to the shop!'
    )

    const response = await ctx.reply({
      embeds: [shopEmbed],
      components: [mainMenuButtons],
      ephemeral: false,
      fetchReply: true
    });

    // const collectorFilter = i => i.user.id === ctx.user.id; 
    const collector = ctx.channel.createMessageComponentCollector({ time: 600_000 });

    let chosenItem;

    collector.on('collect', async (confirmation) => {
      if (confirmation.user.id !== ctx.user.id) {
        return confirmation.reply({ content: "This shop isn't for you! Get your own!", ephemeral: true });
      }

      if (confirmation.customId === 'millButton') {
        await confirmation.update({ embeds: [millEmbed], components: [buyMenuButtons] });
        chosenItem = { cost: 1000000, name: 'Millionaire Role', roleId: '1275097751310303273' };
      } else if (confirmation.customId === 'billButton') {
        chosenItem = { cost: 1000000000, name: 'Billionaire Role', roleId: '1275097910400516116' };
        await confirmation.update({ embeds: [billEmbed], components: [buyMenuButtons] });
      } else if (confirmation.customId === 'returnButton') {
        chosenItem = null;
        await confirmation.update({ embeds: [shopEmbed], components: [mainMenuButtons] });
      } else if (confirmation.customId === 'xpBoost') {
        chosenItem = { cost: 20000, name: 'XP Boost', roleId: '1289736392930361404' };
        await confirmation.update({ embeds: [xpboostEmbed], components: [buyMenuButtons] });
      } else if (confirmation.customId === 'poorButton') {
        chosenItem = { cost: 1, name: 'Homeless Role', roleId: '1289426194139185202' };
        await confirmation.update({ embeds: [poorEmbed], components: [buyMenuButtons] });
      } else if (confirmation.customId === 'starBoost') {
        chosenItem = { cost: 50000, name: 'Money Boost', roleId: '1289736549675565117' };
        await confirmation.update({ embeds: [starboostEmbed], components: [buyMenuButtons] });
      } else if (confirmation.customId === 'buyButton') {

        // Determine what is being purchased

        console.log(`Button pressed: ${confirmation.customId}, buying: ${chosenItem.name}`)

        // Debug log
        console.log(`User has: ${moneyData.Money}, Item cost: ${chosenItem.cost}`);


        // Check if the user has enough money
        if (moneyData.Money < chosenItem.cost) {
          return confirmation.reply({ content: "You do not have enough Pix-Stars!", ephemeral: true });
        }
        if (isNaN(moneyData.Money)) {
          return confirmation.reply({ content: "An error occurred while processing your transaction.", ephemeral: true });
        }

        // Deduct the cost
        moneyData.Money -= chosenItem.cost; // This will work correctly now
        await moneyData.save(); // Save the new coin amount

        const role = guild.roles.cache.get(chosenItem.roleId);
        if (role) {
          await user.roles.add(role);

          // If it's the XP Boost role, set a timer to remove it after 6 hours
          if (chosenItem.name === 'XP Boost' || 'Money Boost') {
            setTimeout(async () => {
              await user.roles.remove(role);
              console.log(`Removed ${role.name} from ${user.user.tag} after 6 hours.`);
            }, 21600000); // 6 hours in milliseconds
          }
        }
        // Send confirmation message
        const buyEmbed = new EmbedBuilder()
          .setColor(0x8269c2)
          .setTitle(`<:announce:1276188470250832014> 𝙸𝚃𝙴𝙼 𝙱𝙾𝚄𝙶𝙷𝚃 <:announce:1276188470250832014>`)
          .setDescription(`Successfully purchased ${chosenItem.name} for <:xPix_Stars:1275118528844009563>${chosenItem.cost}! You now have <:xPix_Stars:1275118528844009563>${moneyData.Money} Pix-Stars!`);

        await confirmation.update({ embeds: [buyEmbed], components: [] });
      }
    });
  }
})