require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs');
const dataFileName = '../../../data.json';
const data = require(dataFileName);
const apiCalls = require('../../utils/apiCalls');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-mod-creation')
        .setDescription('Sets the #mod-creation channel')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel that will be set as mod-creation')
                .setRequired(true)),

    async execute(client, interaction) {
        await interaction.deferReply();

        //make it so only admins can run this command
        const user = await apiCalls.getServerMember(interaction.user.id);
        if (!user.roles.some(roleId => process.env.ADMIN_ROLE_IDS.includes(roleId))) {
            //todo: make it so only the user can see this reply
            interaction.editReply("Only admins can use this command");
            return;
        }

        console.log(data);

        data.modCreationId = interaction.options.get('channel').value;

        await fs.writeFile(dataFileName, JSON.stringify(data, null, 2), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(data, null, 2));
            console.log('writing to ' + dataFileName);
        });

        interaction.editReply("Successfully set {insert channel here} as mod-creation");

        //todo set the mod-creation channel
    }

}

