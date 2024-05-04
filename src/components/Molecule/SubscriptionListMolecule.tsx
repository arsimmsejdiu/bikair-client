import {SIZES} from "@assets/constant";
import UserSubscription from "@components/UserSubscription";
import React from "react";
import {FlatList, View} from "react-native";

import {UserSubscriptionDetail} from "@bikairproject/shared";
import {subscriptionListStyle} from "@styles/SubscriptionScreenStyles";

interface SubscriptionListMoleculeProps {
    list: UserSubscriptionDetail[]
}

export const SubscriptionListMolecule = ({list}: SubscriptionListMoleculeProps) => {
    return (
        <View style={subscriptionListStyle.wrapper}>
            <FlatList
                data={list}
                keyExtractor={(item) => String(item.id)}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => (
                    <UserSubscription
                        key={index}
                        item={item}
                    />
                )}
                ListHeaderComponent={
                    <View style={{height: 20}}/>
                }
                ListFooterComponent={
                    <View style={{height: 50}}/>
                }
            />
        </View>
    );
};
