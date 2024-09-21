require('dotenv').config();
const dataFileName = '../../data.json';
const data = require(dataFileName);
const utils = require('../../utils/utils')

module.exports = (client, guild) => {
  const serverId = guild.id;
  const serverObject = utils.getDataServerObject(serverId);
  
  //todo test this
  if(!serverObject) {
    utils.addNewServer(serverId);
  }

  //todo test this
  else {
    data.server[serverId] = {}
  }

  utils.writeData(data);
};