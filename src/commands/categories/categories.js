const { SlashCommandBuilder } = require('discord.js');
const { getAllCommandsByCategory } = require('../../utils/utils.js');
const questionJSON = require('../../questions.json');

function makeSlashCommand() {
	const slashCommand = new SlashCommandBuilder()
	.setName('categories')
	.setDescription('Look at all the questions under a specific category')

	const max = 100;
	for(const categoryObj of questionJSON["categories"]) {
		let description = `Look at questions under the ${categoryObj.name} category`
		slashCommand
		.addSubcommand(subcommand =>
			subcommand
				.setName(`${categoryObj.commandName}`)
				.setDescription(description))
	}

	return slashCommand;
}

module.exports = {
	data: makeSlashCommand(),

	async execute(client, interaction) {
        await interaction.deferReply();
        const commandName = interaction.options.getSubcommand();
		const commandId = questionJSON["categories"].find(q => q.commandName === commandName).id;
		getAllCommandsByCategory(interaction, commandId);
	},
};