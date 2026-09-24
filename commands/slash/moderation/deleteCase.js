const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../../schemas/caseSchema');

new Command({
  name: 'delete-case',
  description: 'Moderation: Delete case',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'case',
      description: 'If looking for specific case',
      type: ArgumentType.STRING,
      required: true,
    }),
  ],


  run: async (ctx) => {
    const { guild, client } = ctx;
    await ctx.interaction.deferReply();
    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const specCase = ctx.arguments.getString('case');

      if (specCase) {
        const caseData = await caseSchema.find({ Guild: guild.id, _id: specCase })

        const caseEmbed = new EmbedBuilder()
        .setTitle(`Case Deletion`)
        .setColor('Red')
        .setFooter({
          text: `${ctx.guild.name}`, // Footer text
          iconURL: ctx.guild.iconURL()
        })
        .setTimestamp();

      // If no leaderboard, inform user.
      if (!caseData.length) {
        caseEmbed.setDescription('There is not a case with that ID.');
      } else {
        caseEmbed.setDescription(`Case ${specCase} deleted`)
      }

      await caseSchema.deleteOne({ Guild: guild.id, _id: specCase });
      // Send the leaderboard embed
      await ctx.interaction.editReply({ embeds: [caseEmbed] });
   } 
  }
})