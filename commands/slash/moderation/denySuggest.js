const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({//omfg
  name: 'deny',
  description: 'Reject a suggestion!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'message-id',
      description: 'Message ID of the suggestion.',
      type: ArgumentType.STRING,
      required: true
    }),
    new Argument({
      name: 'reason',
      description: 'Reason for rejection.',
      type: ArgumentType.STRING,
      required: true
    })
  ],

  run: async (ctx) => {
    try{
      const messageId = ctx.arguments.getString('message-id');
      const message = await ctx.channel.messages.fetch(messageId);
      const reason = ctx.arguments.getString('reason');
      const embed = message.embeds[0];

      if (embed && message.author.id === ctx.client.user.id) {
        const currentDescription = embed.description || '';
        const suggestionDeniedEmbed = new EmbedBuilder(embed)
          .setColor('Red')
          .setDescription(`${currentDescription}\n\n<:xtriangle_small:1276263767872770108> **Denial Reason:** ${reason}`)
          .setTitle(`<:xdenied:1276188176238645300> 𝙳𝙴𝙽𝙸𝙴𝙳 <:xdenied:1276188176238645300>`)
          .setFooter({
            text: `This suggestion was denied.`, 
            iconURL: ctx.guild.iconURL() 
          });

        await message.edit({ embeds: [suggestionDeniedEmbed] })
        .then(async () => {
            await ctx.reply({ content: 'Suggestion denied', ephemeral: true });
        })
    } else {
        return ctx.reply({ content: 'Invalid suggestion', ephemeral: true });
    }
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.reply('⚠️ Error occurred during suggestion.');
    }
  }
})