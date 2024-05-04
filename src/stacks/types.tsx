import {ProductCart} from "@models/data/ProductCart";
import {DrawerNavigationProp, DrawerScreenProps} from "@react-navigation/drawer";
import {CompositeNavigationProp, CompositeScreenProps, NavigatorScreenParams} from "@react-navigation/native";
import {StackNavigationProp, StackScreenProps} from "@react-navigation/stack";

import {UserSubscriptionDetail} from "@bikairproject/shared";

//Auth types
export type AuthStackParamList = {
    Intro: undefined
    Phone: undefined
    Code: undefined
    Email: undefined
    SendEmail: undefined
    Map: undefined
    Update: {
        forceUpdate: boolean
    }
}

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = StackScreenProps<AuthStackParamList, T>
export type AuthNavigationProps = StackNavigationProp<AuthStackParamList>

//Home types
export type DrawerStackParamList = {
    Home: NavigatorScreenParams<HomeStackParamList>
    Intro: undefined
    Trips: undefined
    Payment: NavigatorScreenParams<PaymentStackParamList>
    Promotion: undefined
    Notification: NavigatorScreenParams<NotificationsStackParamList>
    Sponsor: undefined
    Help: undefined
    Subscription: NavigatorScreenParams<ProductStackParamList>
    User: undefined
    Terms: undefined
};

export type DrawerStackScreenProps<T extends keyof DrawerStackParamList> = DrawerScreenProps<DrawerStackParamList, T>
export type DrawerNavigationProps = DrawerNavigationProp<DrawerStackParamList>

//Home types
export type HomeStackParamList = {
    Map: undefined
    Photo: undefined
    TripStart: undefined
    TripSteps: undefined
    TripStop: undefined
    TripPause: undefined
    BikeStatus: undefined
    BikeTags: undefined
    Cookies: undefined
    CustomizeCookies: undefined
    TripEnd: undefined
    W3DSecure: {
        uri: string
    }
    Update: {
        forceUpdate: boolean
    },
    News: undefined
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<StackScreenProps<HomeStackParamList, T>, DrawerStackScreenProps<keyof DrawerStackParamList>>
export type HomeNavigationProps = CompositeNavigationProp<StackNavigationProp<HomeStackParamList>, DrawerNavigationProps>

export type ProductStackParamList = {
    Offers?: {
        type?: string
    }
    MyCart: {
        OfferItem: ProductCart
    }
    ProductSuccess: undefined
    ProductCancel: {
        Item: UserSubscriptionDetail
    }
    ProductDeleted: undefined
    ProductError: undefined
};

export type ProductStackScreenProps<T extends keyof ProductStackParamList> = CompositeScreenProps<StackScreenProps<ProductStackParamList, T>, DrawerStackScreenProps<keyof DrawerStackParamList>>
export type ProductNavigationProps = CompositeNavigationProp<StackNavigationProp<ProductStackParamList>, DrawerNavigationProps>


//Home types
export type PaymentStackParamList = {
    PaymentInfo: undefined
    PaymentAdd?: {
        clientSecret?: string
    }
};

export type PaymentStackScreenProps<T extends keyof PaymentStackParamList> = CompositeScreenProps<StackScreenProps<PaymentStackParamList, T>, DrawerStackScreenProps<keyof DrawerStackParamList>>
export type PaymentNavigationProps = CompositeNavigationProp<StackNavigationProp<PaymentStackParamList>, DrawerNavigationProps>

//Notification types
export type NotificationsStackParamList = {
    NotificationList: undefined
    NotificationItem: {
        Item: any
    }
    NotificationOption: undefined
};

export type NotificationsStackScreenProps<T extends keyof NotificationsStackParamList> = CompositeScreenProps<StackScreenProps<NotificationsStackParamList, T>, DrawerStackScreenProps<keyof DrawerStackParamList>>
export type NotificationsNavigationProps = CompositeNavigationProp<StackNavigationProp<NotificationsStackParamList>, DrawerNavigationProps>
