const path = require('path');
const WebSocket = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Client, IntentsBitField, ActivityType } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);

    client.user.setActivity({
        name: "SLAYMI EN TRAIN DE MACRO EN BIEN BIEN",
        type: ActivityType.Watching,
    });
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    console.log(message.content);
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'hey') {
        interaction.reply('hey!');
    }
    if (interaction.commandName === 'add') {
        const num1 = interaction.options.get('first-number').value;
        const num2 = interaction.options.get('second-number').value;

        interaction.reply(`The sum is ${num1 + num2}`);
    }

    if (interaction.commandName === 'ping') {
        try {
            const ws = new WebSocket('ws://localhost:8080');
            ws.on('open', () => {
                ws.send('ping from Discord bot!');
                interaction.reply('Pinged the Minecraft mod');
            });
            ws.on('error', (error) => {
                interaction.reply('Connection refused. Is your Minecraft running with the mod?');
            });
        } catch (error) {
            interaction.reply(`An unexpected error occurred : ${error}`);
        }
    }
});

client.login(process.env.TOKEN);