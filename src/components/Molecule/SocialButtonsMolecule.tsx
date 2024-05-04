import {Facebook, Instagram} from "@assets/index";
import {ImageAtom} from "@components/Atom";
import React from "react";
import {TouchableOpacity, View} from "react-native";
import {UserFunctions} from "@models/enums";
import {useAppSelector} from "@hooks/useAppSelector";

interface SocialButtonsMoleculeProps {
    handlePressFace: () => void,
    handlePressInsta: () => void
}

export const SocialButtonsMolecule = ({handlePressFace, handlePressInsta}: SocialButtonsMoleculeProps) => {
    const userFunctions = useAppSelector(state => state.auth.functionalities);

    if ((userFunctions?.functionalities ?? []).includes(UserFunctions.SHOW_SOCIAL_BUTTONS)) {
        return (
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 10
            }}>
                <TouchableOpacity onPress={handlePressFace}>
                    <ImageAtom source={Facebook} style={{width: 40, height: 40, marginRight: 15}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePressInsta}>
                    <ImageAtom source={Instagram} style={{width: 40, height: 40}}/>
                </TouchableOpacity>
            </View>
        );
    } else {
        return null;
    }

};
