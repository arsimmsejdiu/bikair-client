import {COLORS, SIZES} from "@assets/index";
import TextButton from "@components/Molecule/TextButton";
import {useAppDispatch} from "@hooks/index";
import {
    productTabActiveClickEvent,
    productTabOffersClickEvent,
    productTabPassClickEvent,
    productTabSubscriptionClickEvent
} from "@redux/reducers/events";
import {setSelectedTab, setSubscription} from "@redux/reducers/products";
import {store} from "@redux/store";
import {tabButtonsStyles} from "@styles/TabButtonsStyles";
import React from "react";
import {View} from "react-native";

interface IProps {
    selectedTab?: any,
    buttonPass?: any,
    buttonSubs?: any
}

const TabButtons = ({selectedTab, buttonPass, buttonSubs}: IProps) => {
    const dispatch = useAppDispatch();

    return (
        <View style={tabButtonsStyles.container}>
            <TextButton
                buttonContainerStyle={{
                    flex: 1,
                    borderRadius: SIZES.radius,
                    backgroundColor: (selectedTab === "PASS") ? COLORS.lightBlue : COLORS.transparentPrimary9
                }}
                label={buttonPass}
                labelStyle={{
                    color: (selectedTab === "PASS") ? COLORS.white : COLORS.lightBlue
                }}
                actionLabel={"PASS_TAB"}
                onPress={() => {
                    dispatch(setSelectedTab("PASS"));
                    dispatch(setSubscription(false));
                    if (store.getState().products.active) {
                        dispatch(productTabOffersClickEvent());
                    } else {
                        dispatch(productTabPassClickEvent());
                    }
                }}
            />

            <TextButton
                buttonContainerStyle={{
                    flex: 1,
                    borderRadius: SIZES.radius,
                    marginLeft: SIZES.padding,
                    backgroundColor: (selectedTab === "MY_SUBSCRIPTIONS") ? COLORS.lightBlue : COLORS.transparentPrimary9
                }}
                label={buttonSubs}
                labelStyle={{
                    color: (selectedTab === "MY_SUBSCRIPTIONS") ? COLORS.white : COLORS.lightBlue
                }}
                actionLabel={"SUBSCRIPTION_TAB"}
                onPress={() => {
                    dispatch(setSelectedTab("MY_SUBSCRIPTIONS"));
                    dispatch(setSubscription(true));
                    if (store.getState().products.active) {
                        dispatch(productTabActiveClickEvent());
                    } else {
                        dispatch(productTabSubscriptionClickEvent());
                    }
                }}
            />

        </View>
    );
};

export default TabButtons;
