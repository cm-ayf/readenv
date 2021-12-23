/**
 * reads environment variables as specified with options
 * @param options specifies object you need
 * @returns object with common keys with options and string result values
 * @throws if more than one key has neither environment variable nor default; throws everything at once
 */
export default function readenv<
    T extends {
        [K in string]: Option<any, any>;
    }
>(options: T) {
    const env = {} as {
        [K in keyof T]:
            | (T[K] extends OptionDefault<infer D> ? D : never)
            | (T[K] extends OptionParse<infer P> ? P : string);
    };
    const errs = [] as Error[];

    for (const key in options) {
        const option = options[key];
        const value = process.env[options[key]['from'] ?? key];
        if (hasDefault(option))
            env[key] = hasParse(option)
                ? value
                    ? option.parse(value)
                    : option.default
                : value ?? option.default;
        else if (value !== undefined)
            env[key] = hasParse(option) ? option.parse(value) : value;
        else errs.push(new Error(`${options[key]['from'] ?? key} not found`));
    }

    if (errs.length) throw new Error(errs.map((e) => e.toString()).join('\n'));
    return env;
}

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

/**
 * specifies how to read variable. one `Option` per one variable.
 */
interface Option<D, P> extends OptionBase {
    /**
     * default value used when variable was not found.
     * if omitted throws error if variable was not found.
     */
    default?: D;
    /**
     * alternative variable name.
     * if omitted use property name of `options`.
     */
    from?: string;
    /**
     * parser used after value was read.
     * if omitted returns string value.
     */
    parse?(src: string): P;
}
