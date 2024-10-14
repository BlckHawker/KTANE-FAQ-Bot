const { SlashCommandBuilder } = require('discord.js');
const { sendQuestion } = require('../../utils/utils.js');
const questionJSON = require('../../questions.json');
//todo dynamically make these slash commands
module.exports = {
	data: new SlashCommandBuilder()
		.setName('questions')
		.setDescription('Test command that provides information about the user.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('help')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('question-not-here')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('modding-start')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('c-sharp-tutorials')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('mod-tutorials')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('shortcut')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('github')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('mod-reference')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('create-manual')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('add-manual')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('change-manual')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('request-delay')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('become-maintainer')
				.setDescription('This does not matter'))				
		.addSubcommand(subcommand =>
			subcommand
				.setName('mod-not-working')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('text-see-through')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('mod-building-error')
				.setDescription("This does not matter"))
		.addSubcommand(subcommand =>
			subcommand
				.setName('no-sound')
				.setDescription('This does not matter'))
		.addSubcommand(subcommand =>
			subcommand
				.setName('on-interact-delegate')
				.setDescription('This does not matter')),

	async execute(client, interaction) {
		const commandName = interaction.options.getSubcommand();
		const commandId = questionJSON["questions"].find(q => q.commandName === commandName).commandId;
		sendQuestion(interaction, commandId);
	},
};