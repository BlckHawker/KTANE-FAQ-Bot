const fs = require('fs');
const path = require('path');
const dataFileName = '../data.json';
const data = require(dataFileName);
const questionJSON = require('../questions.json');
//write to the data json
const writeData = (data) => {
    fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
        if (err) return console.log(err);
    });
}

//get a server object based on the id
const getDataServerObject = (serverId) => {

    if(!data.servers) {
        return undefined;
    }
    const serverObjIndex = data.servers.findIndex(obj => obj.serverId === serverId);
    
    if (serverObjIndex === -1) {
        return undefined;
    }
    const server = data.servers[serverObjIndex];

    return { serverObjIndex, server };
}

//add new/overwrite server to data.json
const addNewServer = (serverId) => {
    
    //if server doesn't exist, make a new one with this id
    if(!data.servers) {
        data.servers = [{ serverId }];
    }

    //if the server does exist, add a new object
    else {
        data.servers.push({ serverId });
    }

    writeData(data);
}

//replace placeholders text with their actual data
const replacePlaceholders = (text, args = {}) => {

    //modCreationId: server.modCreationId, repoDiscussionId: server.repoDiscussionId

    //{name} replaced with the user's username
    text = text.replaceAll("{name}", args.name);

    //{modCreationId} replaced with the id
    text = text.replaceAll("{modCreationId}", args.modCreationId);

    //{repoDiscussionId} replaced with the id
    text = text.replaceAll("{repoDiscussionId}", args.repoDiscussionId);

    return text;

}

//helper function that separates categories/questions into groups
const makeGroups = (arr) => {
    const groups = [];
    for(const text of arr) {
        //if groups is an empty arr, populate the first element as an array with the first text object
        if (groups.length === 0) {
            groups.push([text]);
        }

        //Otherwise, check if the last element of arr is "full"
        else if (groups[groups.length - 1].length >= questionJSON["questionsPerPage"]) {
            // if it is, make a new array element
            groups.push([text]);
        }

        else {
            groups[groups.length - 1].push(text);
        }
    }

    return groups;
}

const setUpWarning = (interaction) => {
    interaction.editReply("The bot has not set up for this server. Please contact an admin and instruct them to use the **set-channels** command.");
}

module.exports = {
    writeData,
    getDataServerObject,
    addNewServer,
    replacePlaceholders,
    makeGroups,
    setUpWarning
}