const { EmbedBuilder } = require('discord.js');
const questionJSON = require('../questions.json');
const pagination = require('./pagination');
const placeholderInfo = {
    modCreationId: "201105291830493193",
    repoDiscussionId: "640557658482540564",

}
//replace placeholders text with their actual data
const replacePlaceholders = (text, name = "User") => {


    //{name} replaced with the user's username
    text = text.replaceAll("{name}", name);

    //{modCreationId} replaced with the id
    text = text.replaceAll("{modCreationId}", placeholderInfo.modCreationId);

    //{repoDiscussionId} replaced with the id
    text = text.replaceAll("{repoDiscussionId}", placeholderInfo.repoDiscussionId);

    //replace markdown hyperlinks with <> so the embeds don't appear at the bottom of the message

	const gmRegex = /\[(.+)\]\((.+)\)/gm;
	const regex = /\[(.+)\]\((.+)\)/;

	const matches = text.match(gmRegex);

	if(matches) {
		for(const str of matches) {
			const match = str.match(regex);
			text = text.replaceAll(`[${match[1]}](${match[2]})`, `[${match[1]}](<${match[2]}>)`)
		}
	}
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

//helper method to get all the questions (and their command names) given a category
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

async function getQuestion(interaction, commandId) {

    const desiredObj = questionJSON["questions"].find(q => q.commandId === commandId);

    const messages = [];
    //presumably break the answers into different messages
    const answers = replacePlaceholders(desiredObj.answer).split('this should always an element of one arr');
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
        
        const files = desiredObj.images.filter(img => img.index === i).map(obj => `src/img/${obj.name}`);
        if(files.length > 0) {
            await interaction.channel.send({files: files});
        }
    }
}

module.exports = {
    replacePlaceholders,
    makeGroups,
    getAllCommandsByCategory,
    getQuestion
}