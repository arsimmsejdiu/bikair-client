// eslint-disable-next-line no-undef
module.exports = {
    env: {
        browser: true,
        "es2021": true,
    },
    globals: {
        "it": "readonly" // or "writable" if you plan to reassign it
    },
    ignorePatterns: ["**/jest.preset.ts", "**/jest.config.ts", "**/test-setup.ts"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    overrides: [],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: [
        "@typescript-eslint",
        "simple-import-sort",
        "react-hooks",
    ],
    rules: {
        indent: ["error", 4, { "SwitchCase": 1 }],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "@typescript-eslint/no-explicit-any": ["warn"],
        "simple-import-sort/imports": ["error", {
            groups: [
                ["^((?!\\.\\.\\/|\\.\\/|@bikairproject).)*$"],
                ["^(\\.\\.\\/|\\.\\/)*$"],
            ],
        }],
        "react-hooks/exhaustive-deps": ["warn", {
            "additionalHooks": "(useDidUpdate)",
        }],
    },
    settings: {
        "import/extensions": [".js", ".ts", ".tsx"],
        "import/parsers": {
            "@typescript-eslint/parser": [".ts"],
        },
        "import/resolver": {
            node: {
                extensions: [".js", ".ts", ".tsx"],
            },
        },
    },
};
