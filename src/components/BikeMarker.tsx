import {COLORS} from "@assets/index";
import {getDropImage} from "@components/Atom/DropImage";
import React from "react";
import {StyleSheet, View, ViewProps} from "react-native";
import {Marker} from "react-native-maps";

import {Point} from "@bikairproject/shared";

interface Props extends ViewProps {
    id?: string,
    point: Point,
    status: string,
    handleMarkerClick: (id: string | number | undefined) => void
}

export const BikeMarker: React.FC<Props> = React.memo<Props>((
    {
        id,
        point,
        status,
        handleMarkerClick
    }): React.ReactElement | null => {

    const createPin = (status: string) => {
        switch (status) {
            case "BOOKED":
                return getDropImage(COLORS.yellow, COLORS.black);
            case "RENTAL":
                return getDropImage(COLORS.red, COLORS.black);
            default:
                return getDropImage(COLORS.darkBlue, COLORS.white);
        }
    };

    const pin = createPin(status);

    if (!point) return null;

    return <Marker
        onPress={() => handleMarkerClick(id)}
        coordinate={{
            longitude: point.coordinates[0],
            latitude: point.coordinates[1],
        }}
        tracksViewChanges={false}
    >
        <View style={styles.container}>
            {pin}
        </View>
    </Marker>;
});

const styles = StyleSheet.create({
    container: {
        width: 35,
        height: 46,
        justifyContent: "center",
        alignItems: "center"
    },
});
