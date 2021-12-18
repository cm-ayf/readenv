export default function readenv<T>(option: {
  [K in keyof T]: K extends string ? {
      default?: string,
      from?: string
  } : never
}) {
    const env = {} as { [K in keyof T]: string };
    const errs = [] as Error[];

    for (const key in option) {
        let value = process.env[option[key]['from'] ?? key] ?? option[key]['default'];
        if (value !== undefined) env[key] = value;
        else errs.push(new Error(`${option[key]['from'] ?? key} not found`));
    }

    if (errs.length) throw new Error(errs.map(e => e.toString()).join('\n'));
    return env;
}
