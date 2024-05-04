import {COLORS, FeatherIcon} from "@assets/index";
import {ControlButton} from "@components/Buttons";
import {useAppSelector} from "@hooks/index";
import {useNavigation} from "@react-navigation/native";
import {DrawerNavigationProps} from "@stacks/types";
import {menuButtonStyles} from "@styles/GeneralStyles";
import React from "react";
import {View, ViewProps} from "react-native";

const MenuButton: React.FC<ViewProps> = (): React.ReactElement => {
    const navigation = useNavigation<DrawerNavigationProps>();
    const unread = useAppSelector(state => state.notification.nbUnread);

    return <View style={menuButtonStyles.controls}>
        <ControlButton onClick={navigation.openDrawer} actionLabel={"OPEN_DRAWER"}>
            <FeatherIcon
                name={"menu"}
                size={30}
                color={COLORS.darkGrey}
            />
            {unread !== 0 ? (
                <View style={menuButtonStyles.redPoint}/>
            ) : null}
        </ControlButton>
    </View>;
};

export default MenuButton;
