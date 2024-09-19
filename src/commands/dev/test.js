const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test command that provides information about the user.'),
		options:
    {
        devOnly:  true,
        deleted:  false,
    },
	async execute(_, interaction) {
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};