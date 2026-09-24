const { Component, ComponentType } = require('gcommands');
const relationshipsSchema = require('../schemas/relationshipsSchema');
const { EmbedBuilder } = require('discord.js');

new Component({
    name: 'acceptProposal',
    type: [ComponentType.BUTTON],
    run: async (ctx) => {
        // Get the user that is proposing
        const proposingUser = ctx.customId.split('-')[1]
        // Get the user that is being proposed to
        const marryingUser = ctx.customId.split('-')[2]
        // Get the time (in ms) at which the component is supposed to expire
        const componentExpiryTime = ctx.customId.split('-')[3]

        // Check if current time has exceeded the time at which component is supposed to expire
        if (Date.now() >= componentExpiryTime) return ctx.reply({ content: "This proposal has expired!", ephemeral: true });

        // Check if user that clicked accept button is anyone except the user being proposed to
        if (ctx.user.id !== marryingUser) return ctx.reply({ content: "You can't accept this proposal!", ephemeral: true })

        // ? CHECKING IF USER BEING PROPOSED TO (AKA THE USER THAT CLICKED THE ACCEPT BUTTON) IS ALREADY MARRIED

        // Get marrying user relationship doc
        let marryingUserDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: marryingUser });

        // Create user doc if it doesnt exist
        if (!marryingUserDoc) {
            marryingUserDoc = await relationshipsSchema.create({
                Guild: ctx.guild.id,
                User: marryingUser
            })
        }

        // Check if user being proposed to is already married
        if (marryingUserDoc.Spouse) return ctx.reply(`You are already married to <@${marryingUserDoc.Spouse}>`);

        // ? CHECKING IF USER PROPOSING IS ALREADY MARRIED

        // Get proposing user's relationship doc
        let proposingUserDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: proposingUser });

        // Create user doc if it doesnt exist
        if (!proposingUserDoc) {
            proposingUserDoc = await relationshipsSchema.create({
                Guild: ctx.guild.id,
                User: proposingUser,
            })
        }

        // Check if proposing user is already married
        if (proposingUserDoc.Spouse) return ctx.reply(`This user is already married to <@${proposingUserDoc.Spouse}>`);

        // ? Wed the couple :heart:

        // Update the marryingUser's database document
        marryingUserDoc.Spouse = proposingUser;
        // Update the proposing users's database document
        proposingUserDoc.Spouse = marryingUser;

        // Save documents
        await marryingUserDoc.save()
        await proposingUserDoc.save()

        // Get proposers and marrying user's server profiles
        try {
            const proposerProfile = await ctx.guild.members.fetch(proposingUser);
            const marryingUserProfile = await ctx.guild.members.fetch(marryingUser)

            // Send confirmation message
            const marriedEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`<:xannounce:1276188470250832014> 𝙼𝙰𝚁𝚁𝚈 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${proposerProfile}, ${marryingUserProfile} has accepted your proposal! You're now married!`)
                .setAuthor({ name: proposerProfile.displayName, iconURL: proposerProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setFooter({ text: marryingUserProfile.displayName, iconURL: marryingUserProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })

            // Update the message that the component is attached to
            await ctx.interaction.update({
                content: null,
                embeds: [marriedEmbed],
                components: [] // Remove buttons after the proposal is accepted
            });
        } catch (err) {
            console.log(err);
        }
    }
});