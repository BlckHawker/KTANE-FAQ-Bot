require('dotenv').config();
const path = require('path');
const { SlashCommandBuilder } = require('discord.js')
const fs = require('fs');
const dataFileName = '../../data.json';
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

        //set the mod-creation channel
        data.modCreationId = interaction.options.get('channel').value;

        fs.writeFile(path.join(__dirname, dataFileName), JSON.stringify(data, null, 2), (err) => {
            if (err) return console.log(err);
            console.log(JSON.stringify(data, null, 2));
            console.log('writing to ' + dataFileName);
        });
        
        interaction.editReply({
            content: `Successfully set <#${data.modCreationId}> as mod-creation`,
        });

    }

}

