const { Command, CommandType, Argument, ArgumentType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const relationshipsSchema = require('../../../schemas/relationshipsSchema.js');

new Command({
    name: 'disown',
    description: 'Disown a child!',
    type: [CommandType.SLASH],
    arguments: [
        new Argument({
            name: 'user',
            description: 'The child to disown.',
            type: ArgumentType.USER,
            required: true
        })
    ],
    run: async (ctx) => {
        try {
            // Get command executors relationship doc and create if doesnt exist
            
            const childUser = ctx.arguments.getUser('user');
            let disownerRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: ctx.user.id })
            if (!disownerRelationshipDoc) {
                disownerRelationshipDoc = await relationshipsSchema.create({
                    Guild: ctx.guild.id,
                    User: ctx.user.id
                })
            }

            // Check if command executor is married
            if (!disownerRelationshipDoc.Children?.length) return ctx.reply({ content: "You don't have any children!", ephemeral: true })

            if (!disownerRelationshipDoc.Children.includes(childUser.id)) {
                return ctx.reply({ content: "This user is not your child!", ephemeral: true });
            }

            disownerRelationshipDoc.Children = disownerRelationshipDoc.Children.filter(childId => childId !== childUser.id);
            await disownerRelationshipDoc.save();

            const childRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: childUser.id });
            if (childRelationshipDoc) {
                childRelationshipDoc.Parent = null;
                await childRelationshipDoc.save();
            }

            // Reply with disowned embed
            const disownEmbed = new EmbedBuilder()
                .setAuthor({ name: ctx.user.displayName, iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setColor(0x8269c2)
                .setTitle(`<:xannounce:1276188470250832014> 𝙳𝙸𝚂𝙾𝚆𝙽 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${ctx.user} has disowned ${childUser}.`)
                .setFooter({ text: childUser.username, iconURL: childUser.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) });

            ctx.reply({ embeds: [disownEmbed] });
        } catch (err) {
            console.error(err);
            ctx.reply({ content: "An error occurred while trying to disown the user.", ephemeral: true });
        }
    }
});