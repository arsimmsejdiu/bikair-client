import {useAppDispatch} from "@hooks/index";
import {authLogout} from "@redux/reducers/auth";
import {errorOccured} from "@redux/reducers/events";
import {fetchNotifications} from "@redux/reducers/notification";
import {getSpots} from "@redux/reducers/spot";
import {onSaveToken} from "@services/FCMService";
import React, {useEffect} from "react";
import {ViewProps} from "react-native";

type Props = ViewProps

export const ConnectedActions: React.FC<Props> = ({children}): React.ReactElement | null => {
    // Redux state
    const dispatch = useAppDispatch();

    const onConnectedLoading = async () => {
        try {
            await onSaveToken();
            dispatch(getSpots());
            dispatch(fetchNotifications());
        } catch (error: any) {
            dispatch(errorOccured(error));
            // Logout out
            dispatch(authLogout());
        }
    };

    useEffect(() => {
        onConnectedLoading();
    }, []);

    return (
        <>
            {children}
        </>
    );
};
