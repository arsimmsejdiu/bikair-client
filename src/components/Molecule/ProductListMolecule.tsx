import Offers from "@components/Offers";
import {ProductCart} from "@models/data/ProductCart";
import {ProductStackScreenProps} from "@stacks/types";
import {productListStyle} from "@styles/SubscriptionScreenStyles";
import React from "react";
import {FlatList, View, ViewProps} from "react-native";

import {ProductDetail} from "@bikairproject/shared/dist/dto";

interface Props extends ViewProps, ProductStackScreenProps<"Offers"> {
    list: ProductDetail[],
    selectedTab: "MY_SUBSCRIPTIONS" | "PASS",
    navigation: any
}

export const ProductListMolecule: React.FC<Props> = ({list, selectedTab, navigation}): React.ReactElement => {

    return (
        <View style={productListStyle.wrapper}>
            <FlatList
                data={list}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                    <Offers
                        key={index}
                        item={item}
                        selectedTab={selectedTab}
                        onPress={(p: ProductCart) => navigation.navigate("MyCart", {OfferItem: p})}/>
                )}
                ListHeaderComponent={
                    <View style={productListStyle.headerHeight}/>
                }
                ListFooterComponent={
                    <View style={productListStyle.footerHeight}/>
                }
            />
        </View>
    );
};
