# KTANE-FAQ
This bot is to answer questions for people who need help creating mods in the KTANE Server. 

## Setup
Setup instructions for people who want to help develop this project

1. Set up the .evn
    - Rename `example env.txt` to `.env`
    - Replace the placeholder information
        - `DISCORD_TOKEN` the token of the bot
        - `CLIENT_ID` - the id of the bot
        - `SERVER_ID` - the id of the server the bot is in
        - `DEV_IDS` - the discord ids of the developers (used to run "dev commands")
        - `ADMIN_ROLE_IDS` - the discord ids of the admins (used to run "admin commands")
2. run `npm i` to install dependencies
3. run the bot with `nodmon` or `node .`
4. run either of the `setChannels` commands in order for the bot to initalize data for that server
