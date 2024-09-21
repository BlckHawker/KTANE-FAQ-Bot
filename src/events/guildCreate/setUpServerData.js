require('dotenv').config();
const dataFileName = '../../data.json';
const data = require(dataFileName);
const utils = require('../../utils/utils')

module.exports = (client, guild) => {
  const serverId = guild.id;
  const serverObject = utils.getDataServerObject(serverId);
  
  //if the object doesn't exist, make it
  if(!serverObject) {
    utils.addNewServer(serverId);
  }

  //overwrite the object to be just the serverId
  else {
    const{ serverObjIndex } = serverObject;
    data.servers[serverObjIndex] = {serverId}
    console.log(data);
  }

  //todo register commands here just in case 'ready' hasn't been called

  utils.writeData(data);
};