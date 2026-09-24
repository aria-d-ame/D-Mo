const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const caseSchema = require('../../../schemas/caseSchema');

new Command({
  name: 'view-cases',
  description: 'Moderation: Cases',
  type: [CommandType.SLASH],
  arguments: [
    new Argument({
      name: 'case',
      description: 'If looking for specific case',
      type: ArgumentType.STRING,
      required: false,
    }),
    new Argument({
      name: 'sort',
      description: 'Sort, default sorted by time',
      type: ArgumentType.STRING,
      required: false,
      choices: [
        { name: 'User', value: 'user' },
        { name: 'Type', value: 'type' },
        { name: 'Moderator', value: 'mod' },
      ],
    })
  ],


  run: async (ctx) => {
    const { guild, client } = ctx;
    await ctx.interaction.deferReply();
    const moderatorRole = ctx.guild.roles.cache.get('1269757597301604423');
    if (!moderatorRole || !ctx.member.roles.cache.has(moderatorRole.id)) {
      return ctx.reply({ content: "You do not have permission to use this command.", ephemeral: true });
    }

    const sortType = ctx.arguments.getString('sort');
    const specCase = ctx.arguments.getString('case');

   if (sortType === null) {
        // Get top 10 docs in xpData based on XP, Level fields

      if (specCase) {
        const caseData = await caseSchema.find({ Guild: guild.id, _id: specCase })

        const caseEmbed = new EmbedBuilder()
        .setTitle(`Moderation: Cases (Sort: Time)`)
        .setColor(0x8269c2)
        .setFooter({
          text: `${ctx.guild.name}`, // Footer text
          iconURL: ctx.guild.iconURL()
        })
        .setTimestamp();

      // If no leaderboard, inform user.
      if (!caseData.length) {
        caseEmbed.setDescription('There are no cases to show.');
      } else {
        for (caseDataDoc of caseData) {
          const { _id, User, Type, Moderator } = caseDataDoc;
          const member = await client.users.fetch(User);
          const mod = await client.users.fetch(Moderator);
          caseEmbed.setDescription(`Case: ${_id} | User: ${member.tag} | Type: ${Type} | Moderator: ${mod.tag}`);
        };
      }

      // Send the leaderboard embed
      await ctx.interaction.editReply({ embeds: [caseEmbed] });
      } else {

      const caseData = await caseSchema.find({ Guild: guild.id })
      .sort({
        Time: -1,
      });

      // Create an embed to send the leaderboard
      const caseEmbed = new EmbedBuilder()
        .setTitle(`Moderation: Cases (Sort: Time)`)
        .setColor(0x8269c2)
        .setFooter({
          text: `${ctx.guild.name}`, // Footer text
          iconURL: ctx.guild.iconURL()
        })
        .setTimestamp();

      // If no leaderboard, inform user.
      if (!caseData.length) {
        caseEmbed.setDescription('There are no cases to show.');
      } else {
        // Array consisting of name/level/xp details (string) for each user
        const caseDescriptions = [];

        // Iterates through each xpData document to create name/level/xp details for user and pushes them to
        // to userDescriptions array
        for (caseDataDoc of caseData) {
          const { _id, User, Type, Moderator } = caseDataDoc;
          const member = await client.users.fetch(User);
          const mod = await client.users.fetch(Moderator);
          caseDescriptions.push(`Case: ${_id} | User: ${member.tag} | Type: ${Type} | Moderator: ${mod.tag}`);
        };

        // Join elements in user descriptions array with \n (new line)
        caseEmbed.setDescription(`\`\`\`${caseDescriptions.join('\n')}\`\`\``);
      }

      // Send the leaderboard embed
      await ctx.interaction.editReply({ embeds: [caseEmbed] });
    }
   } 

   if (sortType === 'user') {
          // Get top 10 docs in xpData based on XP, Level fields
      const caseData = await caseSchema.find({ Guild: guild.id })
      .sort({
        User: -1,
      });

      // Create an embed to send the leaderboard
      const caseEmbed = new EmbedBuilder()
        .setTitle(`Moderation: Cases (Sort: User)`)
        .setColor(0x8269c2)
        .setFooter({
          text: `${ctx.guild.name}`, // Footer text
          iconURL: ctx.guild.iconURL()
        })
        .setTimestamp();

      // If no leaderboard, inform user.
      if (!caseData.length) {
        caseEmbed.setDescription('There are no cases to show.');
      } else {
        // Array consisting of name/level/xp details (string) for each user
        const caseDescriptions = [];

        // Iterates through each xpData document to create name/level/xp details for user and pushes them to
        // to userDescriptions array
        for (caseDataDoc of caseData) {
          const { _id, User, Type, Moderator } = caseDataDoc;
          const member = await client.users.fetch(User);
          const mod = await client.users.fetch(Moderator);
          caseDescriptions.push(`Case: ${_id} | User: ${member.tag} | Type: ${Type} | Moderator: ${mod.tag}`);
        };

        // Join elements in user descriptions array with \n (new line)
        caseEmbed.setDescription(`\`\`\`${caseDescriptions.join('\n')}\`\`\``);
      }

      // Send the leaderboard embed
      await ctx.interaction.editReply({ embeds: [caseEmbed] });
   }

   if (sortType === 'Type') {
    const caseData = await caseSchema.find({ Guild: guild.id })
    .sort({
      Type: -1,
    });

    // Create an embed to send the leaderboard
    const caseEmbed = new EmbedBuilder()
      .setTitle(`Moderation: Cases (Sort: User)`)
      .setColor(0x8269c2)
      .setFooter({
        text: `${ctx.guild.name}`, // Footer text
        iconURL: ctx.guild.iconURL()
      })
      .setTimestamp();

    // If no leaderboard, inform user.
    if (!caseData.length) {
      caseEmbed.setDescription('There are no cases to show.');
    } else {
      // Array consisting of name/level/xp details (string) for each user
      const caseDescriptions = [];

      // Iterates through each xpData document to create name/level/xp details for user and pushes them to
      // to userDescriptions array
      for (caseDataDoc of caseData) {
        const { _id, User, Type, Moderator } = caseDataDoc;
        const member = await client.users.fetch(User);
        const mod = await client.users.fetch(Moderator);
        caseDescriptions.push(`Case: ${_id} | User: ${member.tag} | Type: ${Type} | Moderator: ${mod.tag}`);
      };

      // Join elements in user descriptions array with \n (new line)
      caseEmbed.setDescription(`\`\`\`${caseDescriptions.join('\n')}\`\`\``);
    }

    // Send the leaderboard embed
    await ctx.interaction.editReply({ embeds: [caseEmbed] });
   }

   if (sortType === 'mod') {
    const caseData = await caseSchema.find({ Guild: guild.id })
    .sort({
      Moderator: -1,
    });

    // Create an embed to send the leaderboard
    const caseEmbed = new EmbedBuilder()
      .setTitle(`Moderation: Cases (Sort: Moderator)`)
      .setColor(0x8269c2)
      .setFooter({
        text: `${ctx.guild.name}`, // Footer text
        iconURL: ctx.guild.iconURL()
      })
      .setTimestamp();

    // If no leaderboard, inform user.
    if (!caseData.length) {
      caseEmbed.setDescription('There are no cases to show.');
    } else {
      // Array consisting of name/level/xp details (string) for each user
      const caseDescriptions = [];

      // Iterates through each xpData document to create name/level/xp details for user and pushes them to
      // to userDescriptions array
      for (caseDataDoc of caseData) {
        const { _id, User, Type, Moderator } = caseDataDoc;
        const member = await client.users.fetch(User);
        const mod = await client.users.fetch(Moderator);
        caseDescriptions.push(`Case: ${_id} | User: ${member.tag} | Type: ${Type} | Moderator: ${mod.tag}`);
      };

      // Join elements in user descriptions array with \n (new line)
      xpEmbed.setDescription(`\`\`\`${caseDescriptions.join('\n')}\`\`\``);
    }

    // Send the leaderboard embed
    await ctx.interaction.editReply({ embeds: [caseEmbed] });
   }
  }
})