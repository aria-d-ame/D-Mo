const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

new Command({
  name: 'avatar',
  description: 'Get a user\'s avatar',
  type: [CommandType.SLASH],

  arguments: 
  [ new Argument({
    name: 'user', 
    description: 'Target user. If not user provided, will default to the user of the command', 
    type: ArgumentType.USER, 
    required: false 
  }) ],
  
  run: async (ctx) => {
    try{
          const targetUser = ctx.interaction.options.getUser('user') || ctx.user;
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