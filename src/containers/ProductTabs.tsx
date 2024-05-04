import {COLORS} from "@assets/index";
import {ProductListMolecule} from "@components/Molecule/ProductListMolecule";
import {SubscriptionListMolecule} from "@components/Molecule/SubscriptionListMolecule";
import TabButtons from "@components/TabButtons";
import {useAppSelector} from "@hooks/index";
import {useFocusEffect} from "@react-navigation/native";
import {ProductStackScreenProps} from "@stacks/types";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {View, ViewProps} from "react-native";

import {UserSubscriptionDetail} from "@bikairproject/shared";
import {ProductDetail} from "@bikairproject/shared/dist/dto";

interface Props extends ViewProps, ProductStackScreenProps<"Offers"> {
}

const ProductTabs: React.FC<Props> = ({navigation, route}): React.ReactElement => {
    const products = useAppSelector(state => state.products.products);
    const productsUser = useAppSelector(state => state.products.productsUser);
    const [userPassList, setUserPassList] = useState<UserSubscriptionDetail[]>([]);
    const [passList, setPassList] = useState<ProductDetail[]>([]);
    const [userSubscriptionList, setUserSubscriptionList] = useState<UserSubscriptionDetail[]>([]);
    const [subscriptionList, setSubscriptionList] = useState<ProductDetail[]>([]);
    const [isRecurringActive, setIsRecurringActive] = useState(false);
    const [isPassActive, setIsPassActive] = useState(false);

    const selectedTab = useAppSelector(state => state.products.selectedTab);

    const {t} = useTranslation();

    useFocusEffect(
        React.useCallback(() => {
            if (productsUser) {
                const pass: UserSubscriptionDetail[] = productsUser.filter((el: UserSubscriptionDetail) => !el.recurring);
                const subscription: UserSubscriptionDetail[] = productsUser.filter((el: UserSubscriptionDetail) => el.recurring);
                setUserPassList(pass);
                setUserSubscriptionList(subscription);
                setIsPassActive(pass.length > 0);
                setIsRecurringActive(subscription.length > 0);
            }
        }, [productsUser])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (products) {
                const pass: ProductDetail[] = products.filter((el: ProductDetail) => !el.recurring);
                const subscription: ProductDetail[] = products.filter((el: ProductDetail) => el.recurring);

                setPassList(pass);
                setSubscriptionList(subscription);
            }
        }, [products])
    );

    function renderTabContent() {
        if (selectedTab === "PASS") {
            if (isPassActive) {
                return renderSubscriptionList(userPassList);
            } else {
                return renderProductList(passList);
            }
        } else {
            if (isRecurringActive) {
                return renderSubscriptionList(userSubscriptionList);
            } else {
                return renderProductList(subscriptionList);
            }
        }
    }

    const renderSubscriptionList = (list: UserSubscriptionDetail[]) => {
        return (
            <SubscriptionListMolecule list={list}/>
        );
    };

    const renderProductList = (list: ProductDetail[]) => {
        return (
            <ProductListMolecule
                list={list}
                selectedTab={selectedTab}
                navigation={navigation}
                route={route}/>
        );
    };

    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            <TabButtons
                selectedTab={selectedTab}
                buttonPass={t("subscription_screen.pass")}
                buttonSubs={t("subscription_screen.subscription")}
            />
            {renderTabContent()}
        </View>
    );
};

export default ProductTabs;
