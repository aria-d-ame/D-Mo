const moneyUser = require('../schemas/money.js');

async function starRankPosition(userId, serverId) {
    const userIdToFind = `${userId}`;
    const users = await moneyUser.find({}).sort({ Money: -1 });
    const user = users.find(user => user.User.toString() === userIdToFind);
    console.log("Searching for ID:", userIdToFind, user);
    if (!user) {
        console.log(`User with ID ${userIdToFind} not found.`);
        return 0; 
    }
    return users.indexOf(user) + 1;

}

module.exports = starRankPosition;