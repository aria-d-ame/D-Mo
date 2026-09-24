const { Listener } = require('gcommands');
const counting = require('../schemas/countingSchema.js');
const { EmbedBuilder } = require('discord.js');

new Listener({
  name: 'Counting',
  event: 'messageCreate',

  run: async (ctx) => {
    if (!ctx.guild) return;
    if (ctx.author.bot) return;

    try {
        const data = await counting.findOne({ Guild: ctx.guild.id });
        if (!data) return;

        if (ctx.channel.id !== data.Channel) return;

        // Check if message content is a number
        const number = Number(ctx.content);
        if (isNaN(number)) {
            // Optionally react or notify user for invalid input
            return;
        }

        const roleId = '1279589654055620719';
        const roleDuration = 12 * 60 * 60 * 1000

        if (number !== data.Number) {
            // Reset count data and notify user
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await ctx.react('xdenied:1276188176238645300');
            const embed = new EmbedBuilder()
                .setColor(0x8269c2)
                .setDescription(`<:xtriangle_small:1276263767872770108> You ruined everything. Now we have to start from 1. Thanks.`)

            await ctx.reply({ embeds: [embed] });

            try {
                const member = await ctx.guild.members.fetch(ctx.author.id);
                if (member) {
                    await member.roles.add(roleId);
                    console.log(`Role ${roleId} added to ${ctx.author.tag}`);

                    // Add user to roleAssigments
                    const filteredArray = data.RoleAssignments.filter(member => member.userId !== ctx.author.id)
                    filteredArray.push({ userId: ctx.author.id, assignedAt: Date.now() })

                    data.RoleAssignments = filteredArray;

                    await data.save();
                } else {
                    console.error('Member not found:', ctx.author.id);
                }
            } catch (err) {
                console.error('Error assigning role:', err);
            }
        } else if (data.LastUser === ctx.author.id) {
            data.Number = 1; // Reset to initial value
            data.LastUser = null; // Reset the last user
            await data.save();
            await ctx.react('xdenied:1276188176238645300');
            const embed = new EmbedBuilder()
                .setColor(0x8269c2)
                .setDescription(`<:xtriangle_small:1276263767872770108> You can't count twice in a row silly! Start from 1!`)

            await ctx.reply({ embeds: [embed] });

            try {
                const member = await ctx.guild.members.fetch(ctx.author.id);
                if (member) {
                    await member.roles.add(roleId);
                    console.log(`Role <@&${roleId}> added to ${ctx.author.tag}`);
                    const roleAssignment = {
                        userId: ctx.author.id,
                        assignedAt: new Date()
                    };
                    data.RoleAssignments.push(roleAssignment);
                    await data.save();

                    // Remove the role after 24 hours (86,400,000 milliseconds)
                    setTimeout(async () => {
                        try {
                            await member.roles.remove(roleId);
                            console.log(`Role <@&${roleId}> removed from ${ctx.author.tag} after 24 hours`);
                        } catch (err) {
                            console.error('Error removing role:', err);
                        }
                    }, 43200000); // 12 hours in milliseconds
                } else {
                    console.error('Member not found:', ctx.author.id);
                }
            } catch (err) {
                console.error('Error assigning role:', err);
            }
        } else {
            await ctx.react('xapproved:1276185812257738823');
            data.LastUser = ctx.author.id;
            data.Number++;
            await data.save();
        }

        if (number === 69) {
            await ctx.react('👌');
        }

        if (number % 100 === 0) {
            await ctx.react('💯'); 
        }

    } catch (error) {
        console.error('Error handling message:', error);
    }
  }
})