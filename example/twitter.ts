import Twitter from 'twitter-v2';
import readenv from '@cm-ayf/readenv';

const env = readenv({
    consumer_key: { from: 'CONSUMER_KEY' },
    consumer_secret: { from: 'CONSUMER_SECRET' },
    access_token_key: { from: 'ACCESS_TOKEN_KEY' },
    access_token_secret: { from: 'ACCESS_TOKEN_SECRET' },
});

const twitter = new Twitter(env);
