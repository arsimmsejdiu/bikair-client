import {COLORS} from "@assets/constant";
import ErrorMessage from "@components/ErrorMessage";
import Loader from "@components/Loader";
import {NoTripMolecule} from "@components/Molecule/NoTripMolecule";
import {RenderTripsHistory} from "@components/RenderTripsHistory";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import crashlytics from "@react-native-firebase/crashlytics";
import {useFocusEffect} from "@react-navigation/native";
import {getTrips} from "@redux/reducers/trip";
import {DrawerStackScreenProps} from "@stacks/types";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";
import {tripHistoryStyles} from "@styles/TripStyles";
import React, {useCallback} from "react";
import {FlatList, RefreshControl, View, ViewProps} from "react-native";

interface Props extends ViewProps, DrawerStackScreenProps<"Trips"> {
}

const TripsHistoryScreen: React.FC<Props> = (): React.ReactElement => {
    // Redux
    const dispatch = useAppDispatch();
    const trip = useAppSelector(state => state.trip);

    // Fetch bikes list every 30second
    useFocusEffect(
        React.useCallback(() => {
            dispatch(getTrips());
        }, []),
    );

    const onRefresh = async () => {
        if (!trip.isFetching) {
            dispatch(getTrips());
        }
    };

    React.useEffect(() => {
        dispatch(getTrips());
    }, []);

    useFocusEffect(useCallback(() => {
        crashlytics().setAttribute("LAST_SCREEN", "TripsHistoryScreen").then(r => console.log(r));
    }, []));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const renderItem = ({item}) => {
        return <RenderTripsHistory item={item}/>;
    };

    if (trip.isFetching) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    if (trip.trips.length === 0) {
        return <NoTripMolecule/>;
    }

    return (
        <View style={tripHistoryStyles.container}>
            <ErrorMessage message={trip.error}/>
            {trip.trips.length > 0 ? (
                <FlatList
                    data={trip.trips}
                    renderItem={renderItem}
                    refreshControl={
                        <RefreshControl
                            colors={[COLORS.lightBlue]} //Android
                            tintColor={COLORS.lightBlue} // IOS
                            refreshing={trip.isFetching}
                            onRefresh={onRefresh}
                        />
                    }
                    keyExtractor={item => item.uuid}
                />
            ) : null}
        </View>
    );
};

export default TripsHistoryScreen;
