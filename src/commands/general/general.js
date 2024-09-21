const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const questionJSON = require('../../questions.json');
const pagination = require('../../utils/pagination');
const utils = require('../../utils/utils')
module.exports = {
	data: new SlashCommandBuilder()
		.setName('general')
		.setDescription('See commands related to the bot.'),

	async execute(client, interaction) {
        await interaction.deferReply();

		//get all general questions
        const questions = questionJSON["questions"].filter(q => q.category === "General");

        //separate the questions into groups 
        const groups = utils.makeGroups(questions);

        const introMessage = "Here are the questions under the general category";
        const embeds = [];
        for (let i = 0; i < groups.length; i++) {
            //make the page description a list of the question and their command
            let description = groups[i].map(q => `- **${q.question}** - /${q.commandName}`).join('\n')
            const embed = new EmbedBuilder().setDescription(description);

            embeds.push(embed);
        }

        pagination({ introMessage, interaction, embeds });

	},
};