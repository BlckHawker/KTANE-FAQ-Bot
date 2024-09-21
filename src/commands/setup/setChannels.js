require('dotenv').config();
const { SlashCommandBuilder } = require('discord.js')
const dataFileName = '../../data.json';
const data = require(dataFileName);
const apiCalls = require('../../utils/apiCalls');
const utils = require('../../utils/utils')

const channelNames = ["mod-creation", "repo-requests", "repo-discussion"];
//todo: move this to utils
function removeDuplicates(arr) {
    return arr.filter(function (item, pos) { return arr.indexOf(item) == pos; })
}

const automatic = async (interaction) => {
    //finds the channels by their name
    const serverId = interaction.guild.id;

    const channels = await apiCalls.getGuildChannels(serverId);
    const validChannels = [];
    const invalidChannelNames = [];

    //find all of the targeted channels
    for (const name of channelNames) {
        const channel = channels.find(channel => channel.name === name);
        if (channel) {
            validChannels.push(channel);
        }

        else {
            invalidChannelNames.push(name);
        }
    }

    let message = "";

    //if all of the channels were found, save their id to the json
    if (invalidChannelNames.length === 0) {

        const channelIds = validChannels.map(channel => channel.id);
        message = saveChannelIds(channelIds, serverId);
    }

    //if not all the channels weren't found, send a warning
    else {
        message = `Unable to find the following channels \n${invalidChannelNames.map(name => `- ${name}`).join("\n")}\nPlease use the manual version of this command in order to set it`
    }

    interaction.editReply({
        content: message,
    });
}
const manual = (interaction) => {
    //set the channels
    const channelIds = interaction.options._hoistedOptions.map(option => option.value);

    //verify none of the channels are the same
    if (removeDuplicates(channelIds).length != 3) {
        interaction.editReply({ content: `Can't have channels be the same` });
        return;
    }

    //save the data
    let message = saveChannelIds(channelIds, interaction.guild.id);

    interaction.editReply({
        content: message,
    });
}

//helper method that saves the ids of the relevant channels to data.json. Returns the success message;
const saveChannelIds = (channelIds, serverId) => {
    const dataVariableNames = channelNames.map(name => {
        const channelNameSegments = name.split('-');
        let str = channelNameSegments[0];
        for (let i = 1; i < channelNameSegments.length; i++) {
            const segment = channelNameSegments[i];
            str += segment.toUpperCase()[0] + segment.toLowerCase().substring(1);
        }

        return str + "Id";
    });

    let serverObj = utils.getDataServerObject(serverId); 

    //if the server object can't be found, make it
    if(!serverObj) {
        utils.addNewServer(serverId);
    }

    const { serverObjIndex, server } = utils.getDataServerObject(serverId);
    const messageSuccess = [];
    for (let i = 0; i < dataVariableNames.length; i++) {
        server[dataVariableNames[i]] = channelIds[i];
        messageSuccess.push(`- ${channelNames[i]}: <#${channelIds[i]}>`)
    }

    data.servers[serverObjIndex] = server;

    ///save to data.json
    utils.writeData(data);

    return `Successfully set: \n${messageSuccess.join("\n")}`;
}

//make the slash command
const slashCommand = new SlashCommandBuilder()
    .setName('set-channels')
    .setDescription('(admin only) Sets the relevant channels')
    .addSubcommand(subcommand =>
        subcommand
            .setName('automatic')
            .setDescription('(admin only) Finds the relevant channels based on their names'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('manual')
            .setDescription('(admin only) Give the relevant channels as parameters'));

//dynamically add add parameters to the manual subcommand
channelNames.map(channelName => slashCommand.options[1].addChannelOption(option =>
    option.setName(channelName)
        .setDescription(`The channel that will be set as ${channelName}}`)
        .setRequired(true)))

module.exports = {
    data: slashCommand,
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

        const methods = {
            'manual': () => manual(interaction),
            'automatic': () => automatic(interaction),
        }

        methods[interaction.options.getSubcommand()]();
    }

}

