const config = require('../schemas/config.js');

// Get status of tournament
module.exports = async function tournamentStatus() {
    // Fetch tournament config document
    const configDoc = await config.findById('config');
    //hello again. hello :vibe:
    // If it doesnt exist, this means that the tournament has never been run before. In this case, we create a config doc for the tournament with status false
    if (!configDoc) {
        const newConfig = new config({
            _id: 'config',
            tournamentStatus: false
        });

        await newConfig.save();
        return false;
    }

    return configDoc.tournamentStatus;
}

// So yeah this function is responsible for returning the status of the tournament
// You can use this function anywhere in your code to fetch tournament status