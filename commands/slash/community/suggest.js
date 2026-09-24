const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'suggest',
  description: 'Make a suggestion!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'suggestion',
      description: 'What is your suggestion?',
      type: ArgumentType.STRING,
      required: true
    }),
  ],

  run: async (ctx) => {
    try{
      const user = ctx.user;
      const icon = user.displayAvatarURL({ format: 'gif' || 'png', size: 512 });
      const suggestion = ctx.arguments.getString('suggestion');

      const suggestEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝚂𝚄𝙶𝙶𝙴𝚂𝚃𝙸𝙾𝙽 <:xannounce:1276188470250832014>`)
      .setAuthor({ name: user.displayName, iconURL: icon })
      .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n <:xtriangle_small:1276263767872770108> **${suggestion}**`)
      .setTimestamp()
      .setFooter({
        text: `Vote using the emojis below!`, 
        iconURL: ctx.guild.iconURL() 
      })
      const message = await ctx.interaction.reply({ embeds: [suggestEmbed], fetchReply: true });
      await message.react('1276185812257738823');
      await message.react('1276188176238645300');
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.interaction.reply('⚠️ Error occurred during suggestion.');
    }
  }
})