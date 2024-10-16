const { SlashCommandBuilder } = require('discord.js');
const { sendQuestion } = require('../../utils/utils.js');
const questionJSON = require('../../questions.json');

function makeSlashCommand() {
	const slashCommand = new SlashCommandBuilder()
	.setName('questions')
	.setDescription('Ask a question related to ktane modding')

	const max = 100;
	for(const questionObj of questionJSON["questions"]) {
		let description = questionObj.question.substring(0, max - 4);
		if(description.length !== questionObj.question.length) {
			description += '...'
		}
		slashCommand
		.addSubcommand(subcommand =>
			subcommand
				.setName(`${questionObj.commandName}`)
				.setDescription(description))
	}

	return slashCommand;
}

module.exports = {
	data: makeSlashCommand(),

	async execute(client, interaction) {
		const commandName = interaction.options.getSubcommand();
		const commandId = questionJSON["questions"].find(q => q.commandName === commandName).commandId;
		sendQuestion(interaction, commandId);
	},
};