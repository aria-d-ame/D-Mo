const { Component, ComponentType } = require('gcommands');

new Component({
  name: 'report',
  // Set the type of the component
  type: [ComponentType.BUTTON],
  // The function thats called when the button is pressed
  run: async (ctx) => {
    const venterID = ctx.customId.split('-')[1]

    if (venterID === ctx.userId)
      return ctx.reply({ content: "You can't report yourself!", ephemeral: true });

    //the response is the vent message thats sent
    const moderationChannel = ctx.guild.channels.cache.get('1278877530635374675');
    if (moderationChannel) {
      await moderationChannel.send(`<@&1269757597301604423> Report for vent:\nMessage ID: ${ctx.interaction.message.id}\nCase: ${venterID}`);
    } else {
      console.log('Moderation channel not found!');
    }

    await ctx.reply({ content: 'Report sent to moderation.', ephemeral: true });
  }
});

// helo