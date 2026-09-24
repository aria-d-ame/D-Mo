const { Listener } = require('gcommands');
const pointSchema = require('../schemas/activityTournament.js');
const cooldownTime = 60 * 1000;
const tournamentStatus = require('../utils/tournamentStatus.js');

new Listener({
  name: 'Point Gain',
  event: 'messageCreate',

  run: async (ctx) => {
    const { guild, author } = ctx;
    if (!guild || author.bot) return;
    console.log("Tournament status: " + await tournamentStatus());
    if (await tournamentStatus() === false) return;
    // lets check the status of the tournament
    try {
        // Find or create a points record for the user
        let data = await pointSchema.findOne({ Guild: guild.id, User: author.id });
        if (!data) {
            data = await pointSchema.create({
                Guild: guild.id,
                User: author.id,
                Points: 0,
                LastPointTime: Date.now(),
            });
        }
        
        try {
            const member = await guild.members.fetch(author.id);
        } catch (error) {
            console.log(`Failed to fetch member with ID: ${userId} in ${data.Guild}`);
        }

        // ALRIGHT MOVING ON
        //lmao

        const currentTime = Date.now();
        const timeSinceLastPoint = currentTime - data.LastPointTime;

        if (timeSinceLastPoint < cooldownTime) {
            console.log(`User ${author.id} is still in cooldown.`);
            // Skip XP awarding if the cooldown period has not passed
            return;
        }

        // Determine the amount of money to give
        const baseAmount = 1;

        // Add the base amount to the user's money
        data.Points += baseAmount;

        data.LastPointTime = Date.now();

        // Save the updated money data to the database
        console.log(data.Points)

        await data.save();
    } catch (err) {
        console.error('Error handling message:', err);
    }
  }
})