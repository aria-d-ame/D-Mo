const { Component, ComponentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');

new Component({
    name: 'rejectAdoption',
    type: [ComponentType.BUTTON],
    run: async (ctx) => {
        // Get the user that is proposing
        const parentUser = ctx.customId.split('-')[1]
        // Get the user that is being proposed to
        const childUser = ctx.customId.split('-')[2]
        // Get the time (in ms) at which the component is supposed to expire
        const componentExpiryTime = ctx.customId.split('-')[3]

        // Check if current time has exceeded the time at which component is supposed to expire
        if (Date.now() >= componentExpiryTime) return ctx.reply({ content: "This adoption has expired!", ephemeral: true });

        // Check if user that clicked reject button is anyone except the user being proposed to
        if (ctx.user.id !== childUser) return ctx.reply({ content: "This adoption isn't for you!", ephemeral: true })

        // ? REJECT THE PROPOSAL

        // Get proposers and marrying user's server profiles
        try {
            const childProfile = await ctx.guild.members.fetch(childUser);
            const parentProfile = await ctx.guild.members.fetch(parentUser)

            // Send confirmation message
            const rejectedAdoptionEmbed = new EmbedBuilder()
                .setColor('Red')
                .setTitle(`<:xannounce:1276188470250832014> 𝙰𝙳𝙾𝙿𝚃𝙸𝙾𝙽 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${parentProfile}, ${childProfile} has rejected your proposal!`)
                .setAuthor({ name: parentProfile.displayName, iconURL: parentProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setFooter({ text: childProfile.displayName, iconURL: childProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })

            // Update the message that the component is attached to
            await ctx.interaction.update({
                content: null,
                embeds: [rejectedAdoptionEmbed],
                components: [] // Remove buttons after the proposal is accepted
            });
        } catch (err) {
            console.log(err);
        }
    }
});