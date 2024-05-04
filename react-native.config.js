// eslint-disable-next-line no-undef
module.exports = {
    dependencies: {
        ...(process.env.NO_FLIPPER ?
            {
                "react-native-flipper": {
                    platforms: {
                        ios: null,
                    },
                },
            } : {}
        ),
    },
};
