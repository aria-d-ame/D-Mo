const { Command, CommandType } = require('gcommands');
const { EmbedBuilder } = require('discord.js');
const relationshipsSchema = require('../../../schemas/relationshipsSchema.js');

new Command({
    name: 'divorce',
    description: 'Divorce your current spouse!',
    type: [CommandType.SLASH],

    run: async (ctx) => {
        try {
            // Get command executors relationship doc and create if doesnt exist
            let divorcerRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: ctx.user.id })
            if (!divorcerRelationshipDoc) {
                divorcerRelationshipDoc = await relationshipsSchema.create({
                    Guild: ctx.guild.id,
                    User: ctx.user.id
                })
            }

            // Check if command executor is married
            if (!divorcerRelationshipDoc.Spouse) return ctx.reply({ content: "You are not married!", ephemeral: true })

            // ? DIVORCE THE COUPLE

            // Get spouse's relationship doc
            const spouseRelationshipDoc = await relationshipsSchema.findOne({ Guild: ctx.guild.id, User: divorcerRelationshipDoc.Spouse });

            // Get spouse's dicord profile // ! May cause errors if the user is not in the server
            const spouseDiscordProfile = await ctx.guild.members.fetch(divorcerRelationshipDoc.Spouse);
            
            // Set 'spouse' field in documents to null
            divorcerRelationshipDoc.Spouse = null;
            spouseRelationshipDoc.Spouse = null;

            await divorcerRelationshipDoc.save();
            await spouseRelationshipDoc.save();

            // Reply with divorced embed
            const divorceEmbed = new EmbedBuilder()
                .setAuthor({ name: ctx.user.displayName, iconURL: ctx.user.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) })
                .setColor(0x8269c2)
                .setTitle(`<:xannounce:1276188470250832014> 𝙳𝙸𝚅𝙾𝚁𝙲𝙴 <:xannounce:1276188470250832014>`)
                .setDescription(`**«═══✧ ✦ ✧ ✦ ✧═══»**\n${ctx.user} has divorced ${spouseDiscordProfile}.`)
                .setFooter({ text: spouseDiscordProfile.displayName, iconURL: spouseDiscordProfile.displayAvatarURL({ format: 'gif' || 'png', size: 512 }) });

            ctx.reply({ embeds: [divorceEmbed] });
        } catch (err) {
            console.log(err);
        }
    }
});