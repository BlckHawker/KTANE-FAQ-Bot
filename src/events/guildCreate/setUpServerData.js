require('dotenv').config();
const path = require('path');
const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs');
const dataFileName = '../../data.json';
const data = require(dataFileName);
const apiCalls = require('../../utils/apiCalls');

module.exports = (client, guild) => {
  
  //if the server is already exists in data, make it an empty object with just the serverID
  const serverObjIndex = data.servers.findIndex(obj => obj.serverID === guild.id);
  if(serverObjIndex !== -1) {
    data.servers[serverObjIndex] = { serverID: guild.id };
  }

  //if the server doesn't exist, add it to the array
  else {
    data.servers.push({ serverID: guild.id });
  }

  fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
    if (err) return console.log(err);
  });
};