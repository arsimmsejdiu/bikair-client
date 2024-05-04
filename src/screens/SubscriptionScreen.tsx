import {COLORS} from "@assets/index";
import Loader from "@components/Loader";
import {NoOfferMolecule} from "@components/Molecule/NoOfferMolecule";
import ProductTabs from "@containers/ProductTabs";
import {useAppDispatch, useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {setProducts, setProductsUser, setSelectedTab} from "@redux/reducers/products";
import {getProducts, getProductsUser} from "@services/productService";
import {ProductStackScreenProps} from "@stacks/types";
import {setCrashlyticsAttribute} from "@utils/helpers";
import React, {useCallback, useEffect, useState} from "react";
import {View, ViewProps} from "react-native";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";

interface Props extends ViewProps, ProductStackScreenProps<"Offers"> {
}

const SubscriptionScreen: React.FC<Props> = ({navigation, route}): React.ReactElement => {
    const products = useAppSelector(state => state.products.products);
    const productUser = useAppSelector(state => state.products.productsUser);
    const functionalities = useAppSelector(state => state.auth?.functionalities);

    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);

    const getProduct = async () => {
        setLoading(true);
        try {
            const responseProducts = await getProducts(functionalities?.city_id);
            dispatch(setProducts(responseProducts));

            const responseProductsUser = await getProductsUser();
            dispatch(setProductsUser(responseProductsUser));
        } catch (err) {
            console.log("Products Error", err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getProduct().then(r => console.log(r));
        }, [])
    );

    useEffect(() => {
        console.log("route.param changes to ", route.params?.type);
        if (route.params?.type) {
            switch (route.params.type) {
                case "subscription":
                    dispatch(setSelectedTab("MY_SUBSCRIPTIONS"));
                    break;
                case "pass":
                    dispatch(setSelectedTab("PASS"));
                    break;
            }
        }
    }, [route.params]);

    useFocusEffect(useCallback(() => {
        setCrashlyticsAttribute("LAST_SCREEN", "SubscriptionScreen").then(r => console.log(r));
    }, []));

    if (loading) {
        return <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>;
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: COLORS.white
            }}
        >
            {!products && !productUser ? <NoOfferMolecule/> : <ProductTabs navigation={navigation} route={route}/>}
        </View>
    );
};

export default SubscriptionScreen;


