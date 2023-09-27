/**
 * reads environment variables as specified with options
 * @param options specifies object you need
 * @returns object with common keys with options and string result values
 * @throws if more than one key has neither environment variable nor default; throws everything at once
 */
export function readenv<
    T extends {
        [key: string]: Option<any, any>;
    }
>(options: T) {
    const env = {} as {
        [K in keyof T]:
            | (T[K] extends OptionDefault<infer D> ? D : never)
            | (T[K] extends OptionParse<infer P> ? P : string);
    };
    const unknownKeys: string[] = [];

    for (const key in options) {
        if (!hasOwn(options, key)) continue;
        const option = options[key];
        const envKey = option.from ?? key;
        const value = process.env[envKey];
        if (hasDefault(option))
            env[key] = hasParse(option)
                ? value !== undefined
                    ? option.parse(value)
                    : option.default
                : value ?? option.default;
        else if (value !== undefined)
            env[key] = hasParse(option) ? option.parse(value) : value;
        else unknownKeys.push(envKey);
    }

    if (unknownKeys.length)
        throw new ReferenceError(
            `readenv: Environment variable${
                unknownKeys.length > 1 ? 's' : ''
            } ${formatList(
                unknownKeys.map((k) => `\`${k}\``)
            )} cannot be found in \`process.env\`.`
        );
    return env;
}
export default readenv;

interface OptionBase {
    from?: string;
}

interface OptionDefault<D> extends OptionBase {
    default: D;
}

function hasDefault(option: OptionBase): option is OptionDefault<any> {
    return 'default' in option;
}

interface OptionParse<P> extends OptionBase {
    parse(src: string): P;
}

function hasParse(option: OptionBase): option is OptionParse<any> {
    return 'parse' in option;
}

const hasOwn =
    (Object as any).hasOwn ??
    Function.call.bind(Object.prototype.hasOwnProperty);

let formatList = (list: Iterable<string>): string => {
    const listFormatter = new ((Intl as any).ListFormat ??
        class {
            format(list: Iterable<string>) {
                const array = Array.from(list);
                switch (array.length) {
                    case 0:
                        return '';
                    case 1:
                        return array[0];
                    case 2:
                        return `${array[0]} and ${array[1]}`;
                    default:
                        array[array.length - 1] =
                            'and ' + array[array.length - 1];
                        return array.join(', ');
                }
            }
        })('en');
    return (formatList = listFormatter.format.bind(listFormatter))(list);
};

/**
 * Specifies how a variable should be read.
 * A single `Option` should be provided per one variable.
 */
interface Option<D, P> extends OptionBase {
    /**
     * The default value used when a variable was not found.
     * If omitted, throws an error if the variable was not found.
     */
    default?: D;
    /**
     * The variable name to be read from `process.env`.
     * If omitted, uses the property name of `options`.
     */
    from?: string;
    /**
     * The parser for transforming the value after reading.
     * If omitted, returns a string value.
     */
    parse?(src: string): P;
}
