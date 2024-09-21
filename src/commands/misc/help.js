const { Client, Message, EmbedBuilder, SlashCommandBuilder } = require('discord.js')
const pagination = require('../../utils/pagination');
const utils = require('../../utils/utils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Understand the purpose of the bot and see a list of its command'),

    async execute(client, interaction) {
        
        const { serverObjIndex, server } = utils.getDataServerObject(interaction.guild.id);

        const introMessage = `This bot's purpose is to answer frequently asked questions about modding KTANE. Its goal is to alleviate answering duplicate questions in <#${server.modCreationId}> and <#${server.repoDiscussionId}>. Please try to see if your question(s) are answered here before asking questions there. Please report any bugs about the bot via a [github issue](https://github.com/BlckHawker/KTANE-FAQ-Bot/issues).`;
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

