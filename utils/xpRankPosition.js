const xpUser = require('../schemas/level.js');

async function xpRankPosition(userId, serverId) {
    const userIdToFind = `${userId}`;
    const users = await xpUser.find({}).sort({ Level: -1, XP: -1 });
    const user = users.find(user => user.User.toString() === userIdToFind);
    console.log("Searching for ID:", userIdToFind, user);
    if (!user) {
        console.log(`User with ID ${userIdToFind} not found.`);
        return 0; 
    }
    return users.indexOf(user) + 1;
}

module.exports = xpRankPosition;