const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const relationshipsSchema = require('../../../schemas/relationshipsSchema.js');
const { customId } = require('gcommands/dist/index');

new Command({
  name: 'adopt',
  description: 'Adopt someone in the server!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'user',
      description: 'Who would you like to adopt?',
      type: ArgumentType.USER,
      required: true
    })
  ],

  run: async (ctx) => {
    const parentUser = ctx.user;
    const childUser = ctx.arguments.getUser('user');
    const { guild } = ctx;

    // Check is childUser already has a parent
    let parentDataChild = await relationshipsSchema.findOne({ Guild: guild.id, User: childUser });
    if (parentDataChild?.Parent) {
      return ctx.reply({ content: `<@${childUser}> already has a parent!`, ephemeral: true });
    }

    // Parent user info
    let parentDataUser = await relationshipsSchema.findOne({ Guild: guild.id, User: ctx.user.id });

    // Check if user is trying to adopt themself
    if (childUser.id === parentUser.id) return ctx.reply({ content: `You can't adopt yourself!`, ephemeral: true });

    // Send proposal embed
    const adoptEmbed = new EmbedBuilder()
      .setAuthor({ name: parentUser.displayName, iconURL: parentUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝙰𝙳𝙾𝙿𝚃𝙸𝙾𝙽 <:xannounce:1276188470250832014>`)
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${childUser}, ${parentUser} would like to adopt you!`)
      .setFooter({ text: childUser.displayName, iconURL: childUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) });

    // Unix timestamp at which the components will expire
    const componentsExpiryTime = Date.now() + 60000;

    const acceptButton = new ButtonBuilder()
      .setCustomId(customId('acceptAdoption', parentUser.id, childUser.id, componentsExpiryTime))
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1276185812257738823');
    const rejectButton = new ButtonBuilder()
      .setCustomId(customId('rejectAdoption', parentUser.id, childUser.id, componentsExpiryTime))
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('1276188176238645300')

    const adoptButtons = new ActionRowBuilder()
      .addComponents(acceptButton, rejectButton);

    await ctx.reply({
      embeds: [adoptEmbed],
      components: [adoptButtons],
      ephemeral: false,
      fetchReply: true
    });
  }
})