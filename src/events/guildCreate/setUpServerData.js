require('dotenv').config();
const path = require('path');
const fs = require('fs');
const dataFileName = '../../data.json';
const data = require(dataFileName);

module.exports = (client, guild) => {
  
  //if the server is already exists in data, make it an empty object with just the serverId
  const serverObjIndex = data.servers.findIndex(obj => obj.serverId === guild.id);
  if(serverObjIndex !== -1) {
    data.servers[serverObjIndex] = { serverId: guild.id };
  }

  //if the server doesn't exist, add it to the array
  else {
    data.servers.push({ serverId: guild.id });
  }

  fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
    if (err) return console.log(err);
  });
};