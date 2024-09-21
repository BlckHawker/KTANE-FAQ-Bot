const { Client, Message, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const pagination = require('../../utils/pagination');
const utils = require('../../utils/utils');

const setUpWarning = (interaction) => {
    interaction.editReply("The bot has not set up for this server. Please contact an admin and instruct them to use the **set-channels** command.");
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Understand the purpose of the bot and see a list of its command'),

    async execute(client, interaction) {
        
        interaction.depher



        await interaction.deferReply();


        const serverObject = utils.getDataServerObject(interaction.guild.id);
        //if the server object is undefined, then send an error to notify the admins to use the set up command 
        if(!serverObject) {
            setUpWarning(interaction);
            return;
        }

        const { server } = serverObject;
        if(!server.serverId || !server.modCreationId || !server.repoRequestsId || !server.repoDiscussionId) {
            setUpWarning(interaction);
            return;
        }

        const introMessage = `This bot's purpose is to answer frequently asked questions about modding KTANE. Its goal is to alleviate answering duplicate questions in <#${server.modCreationId}> and <#${server.repoDiscussionId}>. Please try to see if your question(s) are answered here before asking there. Please report any bugs or suggestions about the bot via a [github issue](https://github.com/BlckHawker/KTANE-FAQ-Bot/issues).`;
        const embeds = [];
        const pageDescription = [];
        for (let i = 0; i < 4; i++) {
            const embed = new EmbedBuilder().setDescription(`Page ${i + 1}`);
            if(pageDescription[i]) {
                embed.setDescription(pageDescription[i])
            }
            embeds.push(embed);
        }

        pagination({introMessage, interaction, embeds });
    }

}

