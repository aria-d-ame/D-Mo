const { Component, ComponentType } = require('gcommands');
const relationshipsSchema = require('../schemas/relationshipsSchema');
const { EmbedBuilder } = require('discord.js');

new Component({
    name: 'acceptAdoption',
    type: [ComponentType.BUTTON],
    run: async (ctx) => {
        // Get the user that is trying to adopt
        const parentUser = ctx.customId.split('-')[1]
        // Get the user that is being proposed to
        const childUser = ctx.customId.split('-')[2]
        // Get the time (in ms) at which the component is supposed to expire
        const componentExpiryTime = ctx.customId.split('-')[3]

        // Check if current time has exceeded the time at which component is supposed to expire
        if (Date.now() >= componentExpiryTime) return ctx.reply({ content: "This adoption has expired!", ephemeral: true });

        // Check if user that clicked accept button is anyone except the user being proposed to
        if (ctx.user.id !== childUser) return ctx.reply({ content: "You can't accept this adoption!", ephemeral: true })

        // ? CHECKING IF USER BEING PROPOSED TO (AKA THE USER THAT CLICKED THE ACCEPT BUTTON) ALREADY HAS A PARENT

        // Get child relationship doc
        let childUserDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: childUser });

        // Create user doc if it doesnt exist
        if (!childUserDoc) {
            childUserDoc = await relationshipsSchema.create({
                Guild: ctx.guild.id,
                User: childUser
            })
        }

        // Check if user being proposed to is already married
        if (childUserDoc.Parent) return ctx.reply(`You already have a parent, <@${childUserDoc.Parent}>`);

        // // ? CHECKING IF USER PROPOSING IS ALREADY MARRIED

        // Get proposing user's relationship doc
        let parentUserDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: parentUser });

        // Create user doc if it doesnt exist
        if (!parentUserDoc) {
            parentUserDoc = await relationshipsSchema.create({
                Guild: ctx.guild.id,
                User: parentUser
            })
        }

        // Update the parentUserDoc database document
        parentUserDoc.Children = [...(parentUserDoc.Children || []), childUser];
        // Update the proposing users's database document
        childUserDoc.Spouse = parentUser;

        // Save documents
        await parentUserDoc.save()
        await childUserDoc.save()

        // Get proposers and marrying user's server profiles
        try {
            const parentProfile = await ctx.guild.members.fetch(parentUser);
            const childProfile = await ctx.guild.members.fetch(childUser)

            // Send confirmation message
            const adoptedEmbed = new EmbedBuilder()
                .setColor('Green')
                .setTitle(`<:xannounce:1276188470250832014> 𝙰𝙳𝙾𝙿𝚃𝙸𝙾𝙽 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${parentProfile}, ${childProfile} has accepted your adoption!`)
                .setAuthor({ name: parentProfile.displayName, iconURL: parentProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setFooter({ text: childProfile.displayName, iconURL: childProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })

            // Update the message that the component is attached to
            await ctx.interaction.update({
                content: null,
                embeds: [adoptedEmbed],
                components: [] // Remove buttons after the proposal is accepted
            });
        } catch (err) {
            console.log(err);
        }
    }
});