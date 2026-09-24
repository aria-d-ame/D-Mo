const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'User Avatar',
  description: 'Get a user\'s avatar',
  type: [CommandType.CONTEXT_USER],

  run: async (ctx) => {
    try{
      const user = ctx.options.getUser(`user`) || ctx.user;
      const member = await ctx.guild.members.fetch(user.id);

      const icon = user.displayAvatarURL({ dynamic: true, size: 2048 });

      const avatarembed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝚄𝚂𝙴𝚁 𝙰𝚅𝙰𝚃𝙰𝚁 <:xannounce:1276188470250832014>`)
      .setAuthor({ name: user.displayName })
      .setDescription('**«═══✧ ✦ ✧ ✦ ✧═══»**')
      .setImage(icon)
      .setFooter({
        text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`, // Footer text
        iconURL: ctx.guild.iconURL() // Optional: Server icon URL
      })

      await ctx.reply({ embeds: [avatarembed] });
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.reply('⚠️ Error occurred while fetching user information.');
    }
  }
})