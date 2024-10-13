const { EmbedBuilder } = require('discord.js');
const questionJSON = require('../questions.json');
const pagination = require('./pagination');
const utils = require('./utils')

//helper method to get all the questions (and their command names) given a category
function getAllCommandsByCategory(interaction, categoryId) {

    const categoryObj = questionJSON["categories"].find(category => category.id === categoryId);
    const questions = questionJSON["questions"].filter(q => q.categoryId === categoryObj.id);

    //separate the questions into groups 
    const groups = utils.makeGroups(questions);

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

module.exports = {getAllCommandsByCategory}