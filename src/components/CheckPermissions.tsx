import {COLORS, FeatherIcon} from "@assets/index";
import {TextAtom} from "@components/Atom";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {setPermissionError} from "@redux/reducers/initialState";
import {checkPermissionsStyles} from "@styles/ClusterStyles";
import React from "react";
import {useTranslation} from "react-i18next";
import {TouchableOpacity, View, ViewProps} from "react-native";

import AppSettingsButton from "./AppSettingsButton";
import MyModal from "./MyModal";

type Props = ViewProps

const CheckPermissions: React.FC<Props> = (): React.ReactElement => {

    const permissionError = useAppSelector(state => state.initialState.permissionError);
    const {t} = useTranslation();

    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(setPermissionError(null));
    };

    return (
        <MyModal visible={permissionError !== null} slide={true}>
            <View style={checkPermissionsStyles.container}>
                <View style={[checkPermissionsStyles.modalView, {
                    alignItems: "center",
                }]}>
                    <View style={checkPermissionsStyles.closeButton}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleClose}
                        >
                            <FeatherIcon
                                name={"x"}
                                size={30}
                                color={COLORS.darkGrey}
                            />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TextAtom style={checkPermissionsStyles.title}>
                            {t("permission_error.title", {permission: permissionError})}{"\n"}
                        </TextAtom>
                        <TextAtom style={checkPermissionsStyles.paragraphe}>
                            {t("permission_error.line_1", {permission: permissionError})}{"\n"}{"\n"}
                            {t("permission_error.line_2")}
                        </TextAtom>
                    </View>
                    <View style={checkPermissionsStyles.buttonContainer}>
                        <AppSettingsButton/>
                    </View>
                </View>
            </View>
        </MyModal>
    );
};

export default CheckPermissions;
