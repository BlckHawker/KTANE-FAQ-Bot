require('dotenv').config();
const path = require('path');
const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs');
const dataFileName = '../../data.json';
const data = require(dataFileName);
const apiCalls = require('../../utils/apiCalls');

function removeDuplicates(arr) {
    return arr.filter(function (item, pos) { return arr.indexOf(item) == pos; })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-channels')
        .setDescription('(admin only) Sets the relevant channels')
        .addChannelOption(option =>
            option.setName('mod-creation')
                .setDescription('The channel that will be set as mod-creation')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('repo-requests')
                .setDescription('The channel that will be set as repo-requests')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('repo-discussion')
                .setDescription('The channel that will be set as repo-discussion')
                .setRequired(true))
    ,

    async execute(client, interaction) {
        await interaction.deferReply({
            ephemeral: true
        });

        //make it so only admins can run this command
        const user = await apiCalls.getServerMember(interaction.user.id);
        if (!user.roles.some(roleId => process.env.ADMIN_ROLE_IDS.includes(roleId))) {

            interaction.editReply({
                content: "Only admins can use this command",
            });
            return;
        }

        //set the channels
        const channels = [
            data.modCreationId = interaction.options.get('mod-creation').value,
            data.repoRequests = interaction.options.get('repo-requests').value,
            data.repoDiscussion = interaction.options.get('repo-discussion').value,
        ]


        //verify none of the channels are the same
        if (removeDuplicates(channels).length != 3) {
            interaction.editReply({ content: `Can't have channels be the same` });
            return;
        }

        fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
            if (err) return console.log(err);
        });


        interaction.editReply({
            content: `Successfully set:
- mod-creation: <#${data.modCreationId}>
- repo-requests: <#${data.repoRequests}> 
- repo-discussion: <#${data.repoDiscussion}>`,
        });

    }

}

