const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const pagination = require('../../utils/pagination');
const utils = require('../../utils/utils');
const questionJSON = require('../../questions.json');

const categoriesPerPage = 5;
const setUpWarning = (interaction) => {
    interaction.editReply("The bot has not set up for this server. Please contact an admin and instruct them to use the **set-channels** command.");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Understand the purpose of the bot and see a list of its command'),

    async execute(client, interaction) {
        await interaction.deferReply();

        const serverObject = utils.getDataServerObject(interaction.guild.id);
        //if the server object is undefined, then send an error to notify the admins to use the set up command 
        if (!serverObject) {
            setUpWarning(interaction);
            return;
        }

        const { server } = serverObject;
        if (!server.serverId || !server.modCreationId || !server.repoRequestsId || !server.repoDiscussionId) {
            setUpWarning(interaction);
            return;
        }

        //get the question object
        const questionObj = questionJSON["questions"].find(obj => obj.commandName === "help");

        //separate the questions into groups 
        const groups = utils.makeGroups(questionJSON["categories"]);

        const introMessage = utils.replacePlaceholders(questionObj.answer, { name: interaction.user.globalName, modCreationId: server.modCreationId, repoDiscussionId: server.repoDiscussionId })

        const embeds = [];
        for (let i = 0; i < groups.length; i++) {
            //make the page description a list of the categories and their description
            let description = groups[i].map(category => `- **/${category.name.toLowerCase().replaceAll(" ", "-")}**: ${category.description}`).join("\n");
            const embed = new EmbedBuilder().setDescription(description);

            embeds.push(embed);
        }

        pagination({ introMessage, interaction, embeds });
    }

}

