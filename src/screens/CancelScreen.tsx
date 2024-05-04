import {COLORS} from "@assets/index";
import TextButton from "@components/Molecule/TextButton";
import {CreateCheckboxComponent} from "@components/Subscription/CreateCheckboxComponent";
import {Canceling} from "@models/constants/canceling";
import {useFocusEffect} from "@react-navigation/native";
import {cancelSubscription} from "@services/productService";
import {ProductStackScreenProps} from "@stacks/types";
import {cancelScreenStyle} from "@styles/CancelScreenStyle";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {StatusBar, Text, TextInput, View, ViewProps} from "react-native";

import {PostCancelProductsUserInput, UserSubscriptionDetail} from "@bikairproject/shared";

interface Props extends ViewProps, ProductStackScreenProps<"ProductCancel"> {
}

const CancelScreen: React.FC<Props> = ({navigation, route}): React.ReactElement => {
    const {Item} = route.params;
    const [loading, setLoading] = useState(false);
    const [cancelSelected, setCancelSelected] = useState<Record<string, boolean>>({});
    const [otherReasons, setOtherReasons] = useState("");
    const [item, setItem] = useState<UserSubscriptionDetail | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        if (route.params?.Item) {
            setLoading(true);
            if (Item) {
                setItem(Item);
            }
        }
        setLoading(false);
    }, [Item, route.params]);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "CancelScreen").then(r => console.log(r));
    }, []));


    const cancelSubscriptionHandler = async () => {
        console.log("handleCancelSubscription");
        if (!item?.id) return;
        setLoading(true);
        try {
            const body: PostCancelProductsUserInput = {
                subscription_id: item.id ?? 0,
                canceled_note: Object.keys(cancelSelected).map(k => t(`subscription_screen.canceled_message.${k}`)) + ", " + otherReasons ?? ""
            };
            await cancelSubscription(body);
            navigation.navigate("ProductDeleted");
            setOtherReasons("");
            setCancelSelected({});
        } catch (err) {
            console.log(err);
            navigation.navigate("ProductError");
        } finally {
            setLoading(false);
        }
    };

    const handleOk = async () => {
        setCancelSelected({});
        setOtherReasons("");
        navigation.navigate("Offers");
    };

    const handleChange = (item: string) => {
        setCancelSelected(cancelSelected => {
            const newIssueSelected = {...cancelSelected};
            const checked = cancelSelected[item];
            if (!checked) {
                newIssueSelected[item] = true;
            } else {
                delete newIssueSelected[item];
            }
            return newIssueSelected;
        });
    };

    return (
        <View style={cancelScreenStyle.cancelContainer}>
            <StatusBar backgroundColor={COLORS.white}/>
            <Text style={cancelScreenStyle.cancelReason}>
                {t("subscription_screen.canceled_reason")}
            </Text>
            {Canceling.map((item, index) => (
                <CreateCheckboxComponent
                    index={index}
                    item={item}
                    cancelSelected={cancelSelected}
                    handleChange={handleChange}
                />
            ))}
            <TextInput
                onChangeText={text => setOtherReasons(text)}
                placeholder={"Autre raison ..."}
                style={cancelScreenStyle.textInput}/>
            <TextButton
                disabled={loading}
                inProgress={loading}
                label={t("parking_photo.valid") ?? "valid"}
                actionLabel={"CANCEL_SUBSCRIPTION_VALIDATE"}
                buttonContainerStyle={cancelScreenStyle.buttonStyle}
                onPress={() => cancelSubscriptionHandler()}
            />
            <TextButton
                disabled={loading}
                inProgress={loading}
                label={t("wording.cancel") ?? "cancel"}
                actionLabel={"CANCEL_SUBSCRIPTION_CANCEL"}
                buttonContainerStyle={cancelScreenStyle.buttonStyle1}
                onPress={handleOk}
            />
        </View>
    );
};

export default CancelScreen;
