import {WarningImg} from "@assets/index";
import {ImageAtom} from "@components/Atom/ImageAtom";
import PrimaryButton from "@components/PrimaryButton";
import {useAppSelector} from "@hooks/index";
import React from "react";
import {useTranslation} from "react-i18next";
import {StyleSheet, View, ViewProps} from "react-native";

interface TripConfirmLockProps extends ViewProps {
    loading?: boolean
    onSubmitYes?: () => void
}

const TripConfirmLock: React.FC<TripConfirmLockProps> = (
    {
        loading,
        onSubmitYes
    }): React.ReactElement | null => {
    const trip = useAppSelector(state => state.trip);
    const {t} = useTranslation();

    const handleSubmit = () => {
        if (typeof onSubmitYes !== "undefined") {
            onSubmitYes();
        }
    };

    return <>
        <ImageAtom
            style={{height: 100, width: 100}}
            resizeMode="contain"
            source={WarningImg}
        />
        <View style={styles.submitContainer}>
            <PrimaryButton
                disabled={loading}
                inProgress={trip.isFetching}
                value={t("wording.confirm")}
                style={{
                    width: "99%"
                }}
                onClick={handleSubmit}
                border='square'
                variant="contained_lightBlue"
            />
        </View>
    </>;
};

export default TripConfirmLock;

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    description: {
        fontSize: 18,
        textAlign: "center"
    },
    submitContainer: {
        flex: 1,
        marginTop: 20,
        justifyContent: "space-between",
        flexDirection: "row"
    }
});

