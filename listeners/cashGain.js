const { Listener } = require('gcommands');
const moneySchema = require('../schemas/money.js');

new Listener({
  name: 'Cash gain',
  event: 'messageCreate',

  run: async (ctx) => {
    //cash gain 

const extraCashRoleId = ['1289736549675565117'];
const boosterRole = ['1275906991511834688'];
const cooldownTime = 60 * 1000; // 10 seconds

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

    const { guild, author } = ctx;
    if (!guild || author.bot) return;

    try {
        // Find or create a money record for the user
        let data = await moneySchema.findOne({ Guild: guild.id, User: author.id });
        if (!data) {
            data = await moneySchema.create({
                Guild: guild.id,
                User: author.id,
                Money: 0,
            });
        }

        const member = await guild.members.fetch(author.id);
        const hasExtraCashRole = member.roles.cache.has(extraCashRoleId);
        const hasBoosterRole = member.roles.cache.some(role => boosterRole.includes(role.id));

        const currentTime = Date.now();
        const timeSinceLastMoney = currentTime - data.LastMoneyTime;

        if (timeSinceLastMoney < cooldownTime) {
            console.log(`User ${author.id} is still in cooldown.`);
            // Skip XP awarding if the cooldown period has not passed
            return;
        }

        // Determine the amount of money to give
        const minGive = 1;
        const maxGive = 3;
        const baseAmount = getRandomInt(minGive, maxGive);

        // Add the base amount to the user's money
        data.Money += baseAmount;

        // If the user has the extra cash role, give an additional bonus
        if (hasExtraCashRole) {
            const extraCash = 10; // Define how much extra money to give
            data.Money += extraCash; // Add extra money to the total
        }
        if (hasBoosterRole) {
            const extraCash = 8; // Define how much extra money to give
            data.Money += extraCash; // Add extra money to the total
        }

        data.LastMoneyTime = Date.now();

        // Save the updated money data to the database
        await data.save();
    } catch (err) {
        console.error('Error handling message:', err);
    }
  }
})