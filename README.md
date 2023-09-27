# @cm-ayf/readenv

type-friendly utility for reading environment variable.

## Setup

```
npm install @cm-ayf/readenv
```

## How to Use

This package exports one function: `readenv`:

```typescript
// typescript
import readenv from 'readenv';
```

or

```javascript
// javascript
const readenv = require('readenv');
```

`readenv` takes one argument, which specifies how you need to read environment variable. For example:

```typescript
const env = readenv({
    TOKEN: {},
    NODE_ENV: {
        default: 'development'
    },
    apiKey: {
        from: 'API_KEY'
    }
});
```

Say you have `dotenv.condig()`ed with `.env` below：

```
# .env
TOKEN=token_keyboard_cat
API_KEY=api_key_keyboard_dog
```

then you will get:

```typescript
const env = {
    TOKEN: 'token_keyboard_cat',
    NODE_ENV: 'development',
    apiKey: 'api_key_keyboard_dog'
};
```

Additionally, this `env` has static type like:

```typescript
const env: {
    TOKEN: string;
    NODE_ENV: string;
    apiKey: string;
};
```

so that you can use it type-safe.

If an environment variable was missing with key that has no default value, **it throws error**. The error will tell you **all environment variables** that were missing.

## API Document

### `readenv(options: { [key: string]: Option })`

Input:
* `options`: Object. The return object will inherit its keys. Each key can be configured with `Option`.

Returns: Object. Inherits keys from `options`. Each value will always be `string`.

Throws: `Error` object that tells us all environment variables missing.

### `Option`

```typescript
interface Option {
    default?: any;
    from?: string;
    parse?(src: string): any;
}
```

Fields:
* `option.default`
  * type: `any`
  * Default value for the key. `readenv()` never throws error about key with `default`.
* `option.from`
  * type: `string?`
  * Environment variable name. Uses key if omitted.
* `option.parse`
  * type: `((src: string) => any)?`
  * Applied after environment variable was read before return. Returns string value if omitted.

## Use Case

Examples are [here](example);

### [twitter-v2](https://www.npmjs.com/package/twitter-v2)

source code from [twitter.ts](example/twitter.ts).

works very well when `new Twitter()`:

```typescript
const env = readenv({
    consumer_key: { from: 'CONSUMER_KEY' },
    consumer_secret: { from: 'CONSUMER_SECRET' },
    access_token_key: { from: 'ACCESS_TOKEN_KEY' },
    access_token_secret: { from: 'ACCESS_TOKEN_SECRET' },
});

const twitter = new Twitter(env);
```
