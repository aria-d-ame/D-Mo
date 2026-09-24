const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Command({
  name: 'approve',
  description: 'Approve a suggestion!',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'message-id',
      description: 'Message ID of the suggestion.',
      type: ArgumentType.STRING,
      required: true
    }),
  ],

  run: async (ctx) => {
    try{
      const messageId = ctx.arguments.getString('message-id');
      const message = await ctx.channel.messages.fetch(messageId);
      const embed = message.embeds[0];

      if (embed && message.author.id === ctx.client.user.id) {
        const suggestionAcceptedEmbed = new EmbedBuilder(embed)
          .setColor('Green')
          .setTitle(`<:xapproved:1276185812257738823> 𝙰𝙿𝙿𝚁𝙾𝚅𝙴𝙳 <:xapproved:1276185812257738823>`)
          .setFooter({
            text: `This suggestion was approved.`, 
            iconURL: ctx.guild.iconURL() 
          });

        await message.edit({ embeds: [suggestionAcceptedEmbed] })
        .then(async () => {
            await ctx.reply({ content: 'Suggestion accepted', ephemeral: true });
        })
    } else {
        return ctx.reply({ content: 'Invalid suggestion', ephemeral: true });
    }
    } catch (error) {
      // Handle any errors that occur
      console.error('⚠️ Error handling document:', error);
      await ctx.reply({ content: '⚠️ Error occurred during suggestion.', ephemeral: true });
    }
  }
})