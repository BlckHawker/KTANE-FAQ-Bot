const questionJSON = require('../../questions.json')
const utils = require('../../utils/utils');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('question-not-here')
		.setDescription(`If the user doesn't see the question`),
	async execute(_, interaction) {
        const question = questionJSON["questions"].find(q => q.commandName === "question-not-here");

        const serverObject = utils.getDataServerObject(interaction.guild.id);
        //if the server object is undefined, then send an error to notify the admins to use the set up command 
        if (!serverObject) {
            utils.setUpWarning(interaction);
            return;
        }

        const { server } = serverObject;
        if (!server.serverId || !server.modCreationId || !server.repoRequestsId || !server.repoDiscussionId) {
            utils.setUpWarning(interaction);
            return;
        }

        const actualAnswer = utils.replacePlaceholders(question.answer, { modCreationId: server.modCreationId, repoDiscussionId: server.repoDiscussionId })
        

		await interaction.reply(`### ${question.question}\n${actualAnswer}`);
	},
};