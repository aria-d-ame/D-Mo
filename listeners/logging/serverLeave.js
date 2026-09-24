const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Server Goodbye',
  event: 'guildMemberRemove',

  run: async (ctx) => {
    if (ctx.user.bot) return;

    console.log(`${ctx.user.username} has left the server.`); // Debug log

    try {
      const goodbyeChannel = await ctx.guild.channels.fetch('1269438676119846953');
      const logChannel = await ctx.guild.channels.fetch('1278877530635374675');

      const leaveEmbed = new EmbedBuilder()
        .setTitle(`<:xtriangle_medium:1276262944836947999> ${ctx.user.username} 𝚑𝚊𝚜 𝚚𝚞𝚒𝚝 ${ctx.guild.name}!`)
        .setColor(0x8269c2)
				.setAuthor({
					name: ' ',
					iconURL: ctx.user.displayAvatarURL() || ' '
				})
        .setTimestamp()
        .setFooter({
          text: `${ctx.guild.name} • Members: ${ctx.guild.memberCount}`,
          iconURL: ctx.guild.iconURL()
        });

      await goodbyeChannel.send({ embeds: [leaveEmbed] });

      const logEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('[ 🛫 ] User Left')
        .setTimestamp()
				.setThumbnail(ctx.displayAvatarURL())
        .setFooter({
          text: `${ctx.guild.memberCount} Members`,
          iconURL: ctx.guild.iconURL()
        })
        .addFields(
          { name: '👤 | User:', value: `<@${ctx.user.id}> (${ctx.user.username})`, inline: false },
          { name: '🪪 | ID:', value: `${ctx.user.id}`, inline: false },
          { name: '\n', value: '\n', inline: false },
          { name: '🔑 | Joined:', value: `<t:${Math.floor(ctx.joinedAt / 1000)}:R>`, inline: true },
          { name: '🛑 | Left:', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
        );

      await logChannel.send({ embeds: [logEmbed] });

    } catch (error) {
      console.error('Error sending goodbye message:', error);
    }
  }
});