const { EmbedBuilder } = require('discord.js');
const questionJSON = require('../questions.json');
const pagination = require('./pagination');
const placeholderInfo = {
    modCreationId: "201105291830493193",
    repoDiscussionId: "640557658482540564",
    repoRequestsId: "612414629179817985",
    logBotId: "317798455110139916",
    ktaneContentRepositoryLink: "[Ktane Content repository](<https://github.com/Timwi/KtaneContent>)",
    manualRepositoryLink: "[Repository of Manual Pages](<https://ktane.timwi.de>)",
    maintainerResponsibilities: "[Repo Maintainer Responsibilities](<https://docs.google.com/document/d/10rabFJES6avb8ime3Cw5LCd9p0663PbqVqzUrfehYac/edit?usp=sharing>)",

}

//replace placeholders text with their actual data
const replacePlaceholders = (text, name = "User") => {


    //{name} replaced with the user's username
    text = text.replaceAll("{name}", name);

    //replace channel ids

    text = text.replaceAll("{modCreationId}", placeholderInfo.modCreationId);

    text = text.replaceAll("{repoDiscussionId}", placeholderInfo.repoDiscussionId);

    text = text.replaceAll("{repoRequestsId}", placeholderInfo.repoRequestsId);

    //replace links

    text = text.replaceAll("{ktaneContentRepositoryLink}", placeholderInfo.ktaneContentRepositoryLink);

    text = text.replaceAll("{manualRepositoryLink}", placeholderInfo.manualRepositoryLink);

    text = text.replaceAll("{maintainerResponsibilities}", placeholderInfo.maintainerResponsibilities);

    //ping logbot
    text = text.replaceAll("{logBotId}", placeholderInfo.logBotId);

    
    //get rid of the any command ids with their actual name
    const commandObjects = questionJSON["questions"].map(q => {return {id: q.commandId, name: q.commandName}});
    const categoryObject = questionJSON["categories"].map(q => {return {id: q.id, commandName: q.commandName, name: q.name}});
    for(const obj of commandObjects) {
        text = text.replaceAll(`{${obj.id}}`, `**${obj.name}** command`);
    }

    for(const obj of categoryObject) {
        text = text.replaceAll(`{${obj.id}}`, `**${obj.name}** commands (**${obj.commandName}**)`);
    }


    return text;

}

//helper function that separates categories/questions into groups


/**
 * separates categories or questions into groups
 * @param {string[]} arr The collection of objects
 * @returns {string[][]} The collection of objects separated into groups
 */
const makeGroups = (arr) => {
    const groups = [];
    for(const text of arr) {
        //if groups is an empty arr, populate the first element as an array with the first text object
        //Otherwise, check if the last element of arr is "full". If it is, make a new array element

        if (groups.length === 0 || groups[groups.length - 1].length >= questionJSON["questionsPerPage"]) {
            groups.push([text]);
        }

        else {
            groups[groups.length - 1].push(text);
        }
    }

    return groups;
}

/**
 * Sends an interactive embedded message of all the questions within a category
 * @param interaction The interaction object
 * @param categoryId The id of the category
 */
function getAllCommandsByCategory(interaction, categoryId) {

    const categoryObj = questionJSON["categories"].find(category => category.id === categoryId);
    const questions = questionJSON["questions"].filter(q => q.categoryId === categoryObj.id);

    //separate the questions into groups 
    const groups = makeGroups(questions);

    const introMessage = `Here are the questions under the **${categoryObj.name}** category`;
        const embeds = [];
        for (let i = 0; i < groups.length; i++) {
            //make the page description a list of the question and their command
            let description = groups[i].map(q => `- **${q.question}** - /${q.commandName}`).join('\n')
            const embed = new EmbedBuilder().setDescription(description);

            embeds.push(embed);
        }

    pagination({ introMessage, interaction, embeds });
}


/**
 * Sends the answer of a specific question
 * @param interaction The interaction object
 * @param commandId The id of the question that is being asked
 */

async function sendQuestion(interaction, commandId) {

    //todo: possibly combine these for loops into one
    const desiredObj = questionJSON["questions"].find(q => q.commandId === commandId);

    //break the answers into different messages
    const messages = [];
    const answers = replacePlaceholders(desiredObj.answer).split('{breakMessage}');
    for(let i = 0; i < answers.length; i++) {
        if(i === 0) {
            messages.push(`## ${desiredObj.question}\n${answers[i]}`);
        } 
        else {
            messages.push(answers[i]);
        }
    }

    //after sending each message, send any images that are possibly attached
    for(let i = 0; i < messages.length; i++) {
        
        await interaction.channel.send(messages[i]);
        
        if(desiredObj.images) {
            const files = desiredObj.images.filter(img => img.index === i).map(obj => `src/img/${obj.name}`);
            if(files.length > 0) {
                await interaction.channel.send({files: files});
            }
        }
    }
}

module.exports = {
    replacePlaceholders,
    makeGroups,
    getAllCommandsByCategory,
    sendQuestion
}