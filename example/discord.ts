import { Client, Intents } from 'discord.js';
import readenv from '@cm-ayf/readenv';

const { BOT_TOKEN, GUILD_ID, CHANNEL_ID } = readenv({
    BOT_TOKEN: {},
    GUILD_ID: {},
    CHANNEL_ID: {},
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', async (client) => {
    let guild = await client.guilds.fetch(GUILD_ID);
    let channel = await guild.channels.fetch(CHANNEL_ID);
    if (channel?.isText()) channel.send('Hello World.');
});

client.login(BOT_TOKEN);
