import { Client, Intents } from 'discord.js';
import readenv from '@cm-ayf/readenv';

const { BOT_TOKEN, GUILD_ID, CHANNEL_ID, TIME, EMOJI } = readenv({
    BOT_TOKEN: {},
    GUILD_ID: {},
    CHANNEL_ID: {},
    TIME: {
        default: 60,
        from: 'TIME_STR',
        parse: (src) => parseInt(src),
    },
    EMOJI: { default: null },
});

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', async (client) => {
    let guild = await client.guilds.fetch(GUILD_ID);
    let channel = await guild.channels.fetch(CHANNEL_ID);
    if (channel?.isText()) channel.send('Hello World.');
    setTimeout(() => {
        if (EMOJI) channel.send(EMOJI);
    }, 1000 * 60 * TIME);
});

client.login(BOT_TOKEN);
