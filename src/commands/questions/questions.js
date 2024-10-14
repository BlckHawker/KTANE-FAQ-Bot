const { SlashCommandBuilder } = require('discord.js');
const { getQuestion } = require('../../utils/utils.js');
// const testImage = require("../../img/unity circle.png")
// const img = require();

const imgPath = 'src/img/';
module.exports = {
	data: new SlashCommandBuilder()
		.setName('questions')
		.setDescription('Test command that provides information about the user.'),
	async execute(client, interaction) {
		//commandId with issues
		/**
		 * modding-start: too long
		 * X mod-reference: Add image
		 * create-manual: too long
		 * add-manual: too long
		 * change-manual:  images not appearing correctly
		 * become-maintainer: 1. {solve} 2. add commands
		 * mod-not-working: 1. images not working 2. add commands 3. identation
		 * mod-building-error: 1. images 2. not an issue with the command itself, but don't need it to be an ordered list
		 * no-sound: 1. images 2. commands
		 * on-interact-delegate: 1. links went through 2. images
		 */

		/**
		 * What to fix in order
		 * 1. Images not appear, send answer into different messages (use a special character to know when the end of the message is). Give the images a index of which message they need to be a part of
		 * 2. Too long of messages. Manually add break message
		 * 3. commands
		 * 5. formatting link
		 */

		//todo: manually add <> so embeds don't appear
		
		getQuestion(interaction, "create-manual");
		//await interaction.reply(text);
	},
};