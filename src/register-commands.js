const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey!',
    },
    {
        name: 'ping',
        description: 'Sends a ping command through the WebSocket',
    },
    {
        name: 'socket',
        description: 'Handles the connection between the bot and the mod',
        options: [
            {
                name: 'action',
                description: 'The action',
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'connect',
                        value: 'connect',
                    },
                    {
                        name: 'disconnect',
                        value: 'disconnect',
                    },
                ],
                required: true,
            }
        ]
    },
];

const rest= new REST({ version: '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('Successfully registered slash commands');
    } catch (error) {
        console.error(`There was an error: ${error}`);
    }
})();