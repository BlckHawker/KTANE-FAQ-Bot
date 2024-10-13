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
		 * github: formatting link for "should be on the same level of your “Assets” folder" is wrong
		 * X mod-reference: Add image
		 * create-manual: too long
		 * add-manual: too long
		 * change-manual:  images not appearing correctly
		 * become-maintainer: 1. formatting link for :bip: not correct 2. {solve} 3. add commands
		 * mod-not-working: 1. images not working 2. add commands 3. identation
		 * mod-building-error: 1. images 2. not an issue with the command itself, but don't need it to be an ordered list
		 * no-sound: 1. images 2. commands
		 * on-interact-delegate: 1. links went through 2. images
		 */

		/**
		 * What to fix in order
		 * 1. Images not appear, send answer into different messages (use a special character to know when the end of the message is). Give the images a index of which message they need to be a part of
		 * 2. Too long of messages. If an answer has a (break message thing), then this doesn't need to be done. If the character will go over 2k, break it. Only break messages where the \n character is\
		 * 3. commands
		 * 4. links go through (on-interact-delegate)
		 * 5. formatting link
		 */

		
		getQuestion(interaction, "mod-reference");
		//await interaction.reply(text);
	},
};