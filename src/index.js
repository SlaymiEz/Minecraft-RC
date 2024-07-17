const path = require('path');
const WebSocket = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { Client, IntentsBitField, ActivityType } = require('discord.js');

let ws;

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

    if (interaction.commandName === 'ping') {
        if (ws != null && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send('ping from Discord bot!');
                interaction.reply('Pinged the Minecraft mod');
            } catch (error) {
                interaction.reply(`An unexpected error occurred : ${error}`);
            }
        } else {
            interaction.reply('Not connected to the socket');
        }
    }

    if (interaction.commandName ==='socket') {
        const actionStr = interaction.options.get('action').value;
        if (actionStr === 'connect') {
            if (ws == null || ws.readyState === WebSocket.CLOSED) {
                console.log('Sending a connection request to the socket...');
                try {
                    ws = new WebSocket('ws://localhost:8080');
                    ws.on('open', () => {
                        interaction.reply('Connected to the WebSocketServer');
                    });
                    ws.on('error', (error) => {
                        interaction.reply(`An unexpected error occurred : ${error}`);
                    });
                } catch (error) {
                    interaction.reply(`An unexpected error occurred : ${error}`);
                }
            } else {
                interaction.reply('Already connected to the socket');
            }
        } else if (actionStr === 'disconnect') {
            console.log('Sending a disconnection request to the socket...');
            if (ws != null && ws.readyState === WebSocket.OPEN) {
                ws.close();
                interaction.reply('Disconnected from the WebSocketServer');
            } else {
                interaction.reply('Not connected to the socket');
            }
        }
    }
});

client.login(process.env.TOKEN);