/**
 * reads environment variables as specified with options
 * @param options specifies object you need
 * @returns object with common keys with options and string result values
 * @throws if more than one key has neither environment variable nor default; throws everything at once
 */
export default function readenv<D extends object>(options: {
    [K in keyof D]: Option<D[K]>;
}) {
    const env = {} as { [K in keyof D]: D[K] | string };
    const errs = [] as Error[];

    for (const key in options) {
        let value =
            process.env[options[key]['from'] ?? key] ?? options[key]['default']
        if (value !== undefined) env[key] = value;
        else errs.push(new Error(`${options[key]['from'] ?? key} not found`));
    }

    if (errs.length) throw new Error(errs.map((e) => e.toString()).join('\n'));
    return env;
}

/**
 * specifies how to read variable. one `Option` per one variable.
 */
interface Option<D> {
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
}
