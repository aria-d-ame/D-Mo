const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
  name: 'birthdays',
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const birthdayEmbed = new EmbedBuilder()
      .setColor(0x8269c2)
      .setTitle(`<:xannounce:1276188470250832014> 𝙱𝙸𝚁𝚃𝙷𝙳𝙰𝚈𝚂 <:xannounce:1276188470250832014>`)
      .setDescription(`«════✧ ✦ ✧ ✦ ✧════»
        `)
      .addFields(
        {
          "name": "<:triangle_small:1276263767872770108> 𝙹𝚊𝚗𝚞𝚊𝚛𝚢",
          "value": "**13** - <@672198334789844994> | **16** - <@1233779955477778473>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108> 𝙵𝚎𝚋𝚛𝚞𝚊𝚛𝚢",
          "value": "**6** - <@660409806208630806>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108> 𝙼𝚊𝚛𝚌𝚑",
          "value": "**2** - <@589614934376054800> | **20** - <@688478925705445413> | **23** - <@1068992693046349834>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108> 𝙰𝚙𝚛𝚒𝚕",
          "value": "**14** - <@640645551477751829> | **19** - <@327620430833909760>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝙼𝚊𝚢",
          "value": "**16** - <@350047301638553600> | **23** - <@1149596459960893490>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝙹𝚞𝚗𝚎",
          "value": "**7** - <@555178724178264074> | **12** - <@798623707168899133>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝙹𝚞𝚕𝚢",
          "value": "**7** - <@782036305004462091> | **29** - <@280834438357843971>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝙰𝚞𝚐𝚞𝚜𝚝",
          "value": "**2** - <@651966200322064384> | **3** - <@888041237762949120> | **6** - <@1160964362794696764> | **9** - <@1301714827965628497> | **12** - <@882609298088296498> | **14** - <@720452662197354536> | **25** - <@1290790943049384066> | **27** - <@809422090410393660>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝚂𝚎𝚙𝚝𝚎𝚖𝚋𝚎𝚛",
          "value": "**22** - <@616438229079556123>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108> 𝙾𝚌𝚝𝚘𝚋𝚎𝚛",
          "value": "**12** - <@421795078827278337>",
          "inline": false
         },
         {
          "name": "<:triangle_small:1276263767872770108>  𝙳𝚎𝚌𝚎𝚖𝚋𝚎𝚛",
          "value": "**12** - <@1207833271363178536> | **15** - <@841862260599291915> | **19** - <@1131556070825922652>",
          "inline": false
         }
      )
      .setFooter({
        text: `${ctx.guild.name}`,
        iconURL: ctx.guild.iconURL()
      });
    await ctx.reply({ embeds: [birthdayEmbed], ephemeral: true });
  }
})