# No Default Noise

**Rule:** Do not write config keys whose value equals the tool's documented default.

## Bad

```jsonc
{
  "someArrayOption": [],
  "someObjectOption": {},
  "someBoolOption": false, // already the default
  "nested": {
    "subKey": {}, // empty override of an empty default
  },
}
```

## Good

Omit. The tool already does this.

## Why

Every line of config invites a future reader to ask "what is this overriding?". Empty arrays, empty objects, and values identical to the default override nothing. They are noise pretending to be configuration. Strictness comes from **rule values**, not from listing every key the schema accepts.

## How to apply

- Before adding a key, check the tool's documented default. If equal, do not write it.
- "Placeholder for future override" is not a reason. Add the key when the override actually exists.
- Applies to any JSON / JSONC / YAML / `.*rc*` / `*.config.{js,mjs,cjs,ts,mts,cts}` file.
