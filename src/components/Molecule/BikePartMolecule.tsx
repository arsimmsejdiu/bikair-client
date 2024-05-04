import {COLORS} from "@assets/constant";
import {FontelloIcon} from "@assets/icons/icons";
import {helpCenterStyles} from "@styles/ClusterStyles";
import React from "react";
import {Text, TouchableOpacity, View, ViewProps} from "react-native";

interface PartSvg {
    label: string
    value: string
    sources: string
}

interface BikePartProps extends ViewProps {
    item: PartSvg
    setSelectedPart: (label: string) => void
    isSelected?: boolean
}

export const BikePartMolecule: React.FC<BikePartProps> = ({
    item,
    setSelectedPart,
    isSelected,
    ...props
}): React.ReactElement => {

    return (
        <View>
            <TouchableOpacity
                onPress={() => setSelectedPart(item.label)}
                style={[
                    helpCenterStyles.flatList,
                    {
                        backgroundColor: isSelected
                            ? COLORS.yellow
                            : "#F7F7F7",
                    },
                ]}>
                <FontelloIcon
                    name={item.sources}
                    color={COLORS.darkGrey}
                    size={25}
                />
                <Text style={helpCenterStyles.textFlatList}>{item.label}</Text>
            </TouchableOpacity>
        </View>
    );
};
