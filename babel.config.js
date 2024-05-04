// eslint-disable-next-line no-undef
module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        ["react-native-worklets-core/plugin"],
        ["module-resolver", {
            root: ["./src/"],
            alias: {
                "@components": "./src/components",
                "@styles": "./src/styles",
                "@screens": "./src/screens",
                "@assets": "./src/assets",
                "@containers": "./src/containers",
                "@contexts": "./src/contexts",
                "@hooks": "./src/hooks",
                "@models": "./src/models",
                "@offers": "./src/offers",
                "@native-modules": "./src/native-modules",
                "@permissions": "./src/permissions",
                "@providers": "./src/providers",
                "@redux": "./src/redux",
                "@services": "./src/services",
                "@stacks": "./src/stacks",
                "@trip-steps": "./src/trip-steps",
                "@utils": "./src/utils"
            },
        },
        ],
        ["module:react-native-dotenv", {
            moduleName: "@env",
            path: ".env",
            safe: true,
            allowUndefined: true,
            verbose: true,
        }],
        ["react-native-reanimated/plugin", {
            globals: [],
        }],
    ],
};
