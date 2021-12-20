/**
 * reads environment variables as specified with options
 * @param options specifies object you need
 * @returns object with common keys with options and string result values
 * @throws if more than one key has neither environment variable nor default; throws everything at once
 */
export default function readenv<T>(options: {
    [K in keyof T]: K extends string ? Option : never;
}) {
    const env = {} as { [K in keyof T]: string };
    const errs = [] as Error[];

    for (const key in options) {
        let value =
            process.env[options[key]['from'] ?? key] ?? options[key]['default'];
        if (value !== undefined) env[key] = value;
        else errs.push(new Error(`${options[key]['from'] ?? key} not found`));
    }

    if (errs.length) throw new Error(errs.map((e) => e.toString()).join('\n'));
    return env;
}

/**
 * specifies how to read variable. one `Option` per one variable.
 */
interface Option {
    /**
     * default value used when variable was not found.
     * if omitted throws error if variable was not found.
     */
    default?: string;
    /**
     * alternative variable name.
     * if omitted use property name of `options`.
     */
    from?: string;
}
