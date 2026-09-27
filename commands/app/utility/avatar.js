const { Command, CommandType } = require('gcommands');
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

new Command({
  name: 'User Avatar',
  description: 'Get a user\'s avatar',
  type: [CommandType.CONTEXT_USER],

  run: async (ctx) => {
    try{
      const targetUser = await ctx.client.users.fetch(ctx.interaction.targetId);
      const displayName = targetUser.displayName;
      const username = targetUser.username;
      const icon = targetUser.displayAvatarURL({ 
        extension: 'png',
        dynamic: true, 
        size: 2048 
      });
      const urlButton = new ButtonBuilder()
        .setLabel('🔗 Avatar Link')
        .setStyle(ButtonStyle.Link)
        .setURL(icon);
      const row = new ActionRowBuilder()
        .addComponents(urlButton);

      const avatarembed = new EmbedBuilder()
      .setColor(0xf69f96)
      .setTitle(`✦ 𝚄𝚂𝙴𝚁_𝙰𝚅𝙰𝚃𝙰𝚁 ✦`)
      .setDescription(`**✦ ── ✦ ${displayName} (@${username})✦ ── ✦**`)
      .setImage(icon)
      .setFooter({
        text: `${ctx.guild.name} ✦ Members: ${ctx.guild.memberCount}`, // Footer text
        iconURL: ctx.guild.iconURL() ?? undefined,
      })

      await ctx.reply({ 
        embeds: [avatarembed], 
        components: [row]
      });
    } catch (error) {
      console.error('⚠️ Error handling app command "User Avatar":', error);
      await ctx.reply({
        content: '⚠️ Error occurred while fetching user information.',
        flags: 64
      });
    }
  }
})