const fs = require('fs');
const path = require('path');
const dataFileName = '../data.json';
const data = require(dataFileName);
//write to the data json
const writeData = (data) => {
    fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
        if (err) return console.log(err);
    });
}

//get a server object based on the id
const getDataServerObject = (serverId) => {

    const serverObjIndex = data.servers.findIndex(obj => obj.serverId === serverId);
    if(serverObjIndex) {
        return undefined;
    }
    const server = data.servers[serverObjIndex];

    return { serverObjIndex, server };
}

module.exports = {
    writeData,
    getDataServerObject
}