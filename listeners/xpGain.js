const { Listener } = require('gcommands');
const { EmbedBuilder } = require('discord.js')
const levelSchema = require('../schemas/level.js');
const moneySchema = require('../schemas/money.js');

new Listener({
  name: 'XP Gain',
  event: 'messageCreate',

  run: async (ctx) => {
    const excludedRoles = process.env.COUNT_ROLE
    // const extraXPRoleId = ['1289736392930361404'];
    const boosterRole = process.env.BOOST_ROLE;
    const cooldownTime = 10 * 1000; // 10 seconds

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    };
        const { guild, author, member } = ctx;
        if (!guild || author.bot) return;

        try {
            // Find or create a level record
            let data = await levelSchema.findOne({ Guild: guild.id, User: author.id });
            if (!data) {
                data = await levelSchema.create({
                    Guild: guild.id,
                    User: author.id,
                    XP: 0,
                    Level: 0,
                    LastXPTime: Date.now(),
                });
            }

            const hasExcludedRole = member.roles.cache.some(role => excludedRoles.includes(role.id));
            // const hasExtraXPRole = member.roles.cache.some(role => extraXPRoleId.includes(role.id));
            const hasBoosterRole = member.roles.cache.some(role => boosterRole.includes(role.id));
            const levelRoles = [
                { level: 0, roleId: '1555600028821880913', moneyReward: 0 },
                { level: 5, roleId: '1555600177740648578', moneyReward: 100 },
                { level: 10, roleId: '1555600249236758638', moneyReward: 300 },
                { level: 20, roleId: '1555600302827380857', moneyReward: 1000 },
                { level: 30, roleId: '1555600356069740616', moneyReward: 2000 },
                { level: 40, roleId: '1555600532234702992', moneyReward: 5000 },
                { level: 50, roleId: '1555600605383233737', moneyReward: 10000 },
                { level: 60, roleId: '1555600642498895964', moneyReward: 20000 },
                { level: 70, roleId: '1555600683577774130', moneyReward: 40000 },
                { level: 80, roleId: '1555600708605186200', moneyReward: 60000 },
                { level: 90, roleId: '1555600741853560953', moneyReward: 100000 },
                { level: 100, roleId: '1555600767019393084', moneyReward: 150000 }
            ];

            const levelUpChannelId = process.env.LEVEL_CHANNEL_ID;
            const levelUpChannel = await guild.channels.fetch(levelUpChannelId);

            if (hasExcludedRole) {
                console.log(`User has excluded role`)
                return;
                // Skip XP awarding if the user has an excluded role
            }

            const currentTime = Date.now();
            const timeSinceLastXP = currentTime - data.LastXPTime;

            if (timeSinceLastXP < cooldownTime) {
                console.log(`User ${author.id} is still in cooldown.`);
                // Skip XP awarding if the cooldown period has not passed
                return;
            }

            const minGive = 5;
            const maxGive = 10;
            const give = getRandomInt(minGive, maxGive);

            const requiredXP = data.Level * data.Level * 30;

            console.log(data.XP, give, data.XP + give, requiredXP)
            // console.log(levelRoles[2])e

            if (data.XP + give >= requiredXP) {
                data.XP += give;
                data.Level += 1;
                await data.save();

                // Assign the role and reward money when they reach a specified level
                const currentLevel = data.Level;
                // Checks if current level is a milestone
                if (levelRoles.some(role => role.level === currentLevel)) {
                    // ID and money award of the role to be added to member
                    const { roleId, moneyReward, level } = levelRoles.find(role => role.level === currentLevel);
                    const rolesToBeRemoved = []

                    // Add roleids that are not the current milestone role id to rolesToBeRemoved
                    for (role of levelRoles) {
                        if (role.roleId !== roleId) rolesToBeRemoved.push(role.roleId)
                    }

                    // Add milestone role to user
                    await member.roles.add(roleId);
                    console.log(`Assigned level ${level} milestone role to ${author.tag}`);

                    // Remove previous milestone roles from user
                    await member.roles.remove(rolesToBeRemoved);
                    console.log(`Removed previous milestone roles from ${author.tag}`)

                    // Get money schema. Create if doesnt exist for user.
                    let moneyData = await moneySchema.findOne({ Guild: guild.id, User: author.id });
                    if (!moneyData) {
                        moneyData = await moneySchema.create({
                            Guild: guild.id,
                            User: author.id,
                            Money: 0,
                        });
                    }

                    // Add money reward to user and save to db
                    moneyData.Money += moneyReward;
                    await moneyData.save();
                    console.log(`Added ${moneyReward} money to ${author.tag}`);

                    // Send level up message with milestone notification
                    const embedrole = new EmbedBuilder()
                        .setColor(0xf69f96)
                        .setTitle(`✦ <@&${roleId}>! ✦`)
                        .setDescription(`✦ ${author} has hit a level milestone! Here's  [💧] ${moneyReward} Raindrops!`);

                    await levelUpChannel.send({ embeds: [embedrole] });
                }

                // Send level up message without milestone notification
                const embed = new EmbedBuilder()
                    .setColor(0xf69f96)
                    .setTitle('✦  𝙻𝙴𝚅𝙴𝙻 𝚄𝙿! ✦')
                    .setDescription(`✦ ${author} has reached level [✨] ${data.Level}!`);

                await levelUpChannel.send({ embeds: [embed] });
            } else {
                const extraXP = 10;
                data.XP += give;
                data.LastXPTime = Date.now();
                // if (hasExtraXPRole) { // Define how much extra XP to give
                //    data.XP += extraXP; // Add extra XP to the total
                //}
                if (hasBoosterRole) { // Define how much extra XP to give
                    data.XP += extraXP; // Add extra XP to the total
                }

                await data.save();


            }
        } catch (err) {
            console.error('Error handling message:', err);
        }
  }
})