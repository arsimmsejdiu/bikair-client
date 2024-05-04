import {Info} from "@assets/index";
import {ImageAtom} from "@components/Atom";
import {DepositWarningMolecule} from "@components/Molecule/DepositWarningMolecule";
import {myCartScreenStyles} from "@styles/SubscriptionScreenStyles";
import React from "react";
import {View} from "react-native";

export const DepositWarningOrganism = () => {
    return (
        <View style={myCartScreenStyles.wrappingWarningContent}>
            <View style={myCartScreenStyles.warningInfoContainer}>
                <View style={myCartScreenStyles.warningContainer}>
                    <ImageAtom source={Info} style={myCartScreenStyles.imageInfo}/>
                </View>
                <DepositWarningMolecule />
            </View>
        </View>
    );
};
