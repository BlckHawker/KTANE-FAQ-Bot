require('dotenv').config();
const version = 10;
const baseUrl = `https://discord.com/api/v${version}`;

// helper method for discord get requests
const getAPICall = async (url, body = {
    method:  'GET',
    headers: { 'Authorization': `Bot ${process.env.DISCORD_TOKEN}`, },
}) => {
    return await fetch(url, body).then(response => {
        if (response.status != 200) {
            console.log(`There was an error: ${response.status} ${response.statusText}`);
            return undefined;
        }
        return response.json();

    });
};

//get specific user in the server based on their id
const getServerMember = async (userId) => {
    return await getAPICall(`${baseUrl}/guilds/${process.env.SERVER_ID}/members/${userId}`);
}


//Returns a list of guild channel objects given the guild id. Does not include threads.
const getGuildChannels = async(guildId) => {
    return await getAPICall(`${baseUrl}/guilds/${guildId}/channels`);
    
}


module.exports = {
    getServerMember,
    getGuildChannels
};