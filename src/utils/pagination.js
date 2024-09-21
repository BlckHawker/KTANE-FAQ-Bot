const {ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType} = require('discord.js')


function pageError(str) {
    return new Error(`There was an error with Pagination ${str}. Please contact the developer(s)`);
}

module.exports = async ({interaction, embeds, time, introMessage}) => {
    try {

        introMessage = introMessage ?? '';
        time = time ?? 60000 * 5; //set time to be 5 minute by default
        if(!interaction) {
            throw pageError(`Interaction is ${interaction}`);
        }
        if(!embeds) {
            throw pageError(`Embeds is ${embeds}`);
        }

        if(embeds.length === 0) {
            throw pageError(`Embeds has a length of 0`);
        }

        if(embeds.length === 1) {
            return await interaction.editReply({content: introMessage, embeds: embeds, components: [], fetchReply: true });
        }

        let index = 0;

        const firstButton = new ButtonBuilder()
        .setCustomId('firstPageButton')
        .setEmoji('⏪')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0)

        const previousButton = new ButtonBuilder()
        .setCustomId('previousPageButton')
        .setEmoji('⬅️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === 0)

        const pageButton = new ButtonBuilder()
        .setCustomId('pageCount')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(true)

        function updatePage() {
            pageButton.setLabel(`${index + 1}/${embeds.length}`);
        }

        updatePage(pageButton, index, embeds);

        const nextButton = new ButtonBuilder()
        .setCustomId('nextPageButton')
        .setEmoji('➡️')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === embeds.length - 1)

        const lastButton = new ButtonBuilder()
        .setCustomId('lastPageButton')
        .setEmoji('⏩')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(index === embeds.length - 1);

        function getUpdatedEmbed() {
            return { content: introMessage, embeds: [embeds[index]], components: [buttons], fetchReply: true};
        }

        const buttons = new ActionRowBuilder().addComponents([firstButton, previousButton, pageButton, nextButton, lastButton]);
        const message = await interaction.editReply(getUpdatedEmbed());
        const collector = await message.createMessageComponentCollector({
            ComponentType: ComponentType.Button,
            time
        });

        collector.on('collect', async newInteraction => {
            if(newInteraction.user.id !== interaction.user.id) {
                return await newInteraction.reply({content: `Only **${interaction.user.username}** can use these buttons!`, ephemeral: true})
            }

            await newInteraction.deferUpdate();

            switch(newInteraction.customId) {
                case 'firstPageButton':
                    index = 0;
                break;
                case 'previousPageButton':
                    index--;
                break;
                case 'nextPageButton':
                    index++;
                break;
                case 'lastPageButton':
                    index = embeds.length - 1;
                break;
            }
            updatePage();
            
            firstButton.setDisabled(index === 0);
            previousButton.setDisabled(index === 0);
            nextButton.setDisabled(index === embeds.length - 1);
            lastButton.setDisabled(index === embeds.length - 1);

            await message.edit(getUpdatedEmbed()).catch(err => {});
            collector.resetTimer();
        });

        collector.on('end', async () => {
            await message.edit({ embeds: [embeds[index]], components: []}).catch(err => {});
        });

        return message;
    }

    catch (e) {
        console.log("Error making pagination: " + e);
    }
}