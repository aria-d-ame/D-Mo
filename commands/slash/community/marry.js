const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const relationshipsSchema = require('../../../schemas/relationshipsSchema.js');
const { customId } = require('gcommands/dist/index');

new Command({
  name: 'marry',
  description: 'Marry someone in the server!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Who would you like to marry?',
      type: ArgumentType.USER,
      required: true
    })
  ],

  run: async (ctx) => {
    const proposingUser = ctx.user;
    const marryingUser = ctx.arguments.getUser('user');
    const { guild } = ctx;

    // Check is marryingUser is already married
    let marryDataSpouse = await relationshipsSchema.findOne({ Guild: guild.id, User: marryingUser });
    if (marryDataSpouse?.Spouse) {
      return ctx.reply({ content: `<@${marryingUser}> is already married!`, ephemeral: true });
    }

    // Check if proposingUser is already married
    let marryDataUser = await relationshipsSchema.findOne({ Guild: guild.id, User: ctx.user.id });
    if (marryDataUser?.Spouse) {
      return ctx.reply({ content: `You're already married to <@${marryDataUser.Spouse}>!`, ephemeral: true });
    }

    // Check if user is proposing to themself
    if (proposingUser.id === marryingUser.id) return ctx.reply({ content: `You can't marry yourself dummy`, ephemeral: true });

    // Send proposal embed
    const marryEmbed = new EmbedBuilder()
      .setAuthor({ name: proposingUser.displayName, iconURL: proposingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙰𝚁𝚁𝚈 <:xannounce:1276188470250832014>`)
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${marryingUser}, ${proposingUser} would like to marry you!`)
      .setFooter({ text: marryingUser.displayName, iconURL: marryingUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) });

    // Unix timestamp at which the components will expire
    const componentsExpiryTime = Date.now() + 60000;

    const acceptButton = new ButtonBuilder()
      .setCustomId(customId('acceptProposal', proposingUser.id, marryingUser.id, componentsExpiryTime))
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1276185812257738823');
    const rejectButton = new ButtonBuilder()
      .setCustomId(customId('rejectProposal', proposingUser.id, marryingUser.id, componentsExpiryTime))
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('1276188176238645300')

    const marryButtons = new ActionRowBuilder()
      .addComponents(acceptButton, rejectButton);

    await ctx.reply({
      embeds: [marryEmbed],
      components: [marryButtons],
      ephemeral: false,
      fetchReply: true
    });
  }
})