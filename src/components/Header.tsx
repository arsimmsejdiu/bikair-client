import {COLORS, FeatherIcon} from "@assets/index";
import {TextAtom} from "@components/Atom";
import {DrawerHeaderProps} from "@react-navigation/drawer";
import {StackHeaderProps} from "@react-navigation/stack";
import {headerStyles} from "@styles/GeneralStyles";
import React, {useEffect, useState} from "react";
import {StatusBar, TouchableOpacity, View} from "react-native";

interface HeaderProps {
    title: string
    home?: boolean
    text?: string
    notification?: boolean
    backAction?: () => void
}

type HeaderPropsExtended = HeaderProps & (DrawerHeaderProps | StackHeaderProps)


const Header: React.FC<HeaderPropsExtended> = (
    {
        title,
        home,
        text,
        notification,
        backAction,
        ...props
    }): React.ReactElement | null => {
    // const dispatch = useAppDispatch();
    const [headerTitle, setHeaderTitle] = useState<string>("");
    const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

    const handleNavigation = () => {
        // dispatch(setChange(false));
        const isBackAction = typeof backAction !== "undefined";
        console.log(`Header - ${title} - props.home: `, home);
        console.log(`Header - ${title} - isBackAction: `, isBackAction);
        console.log(`Header - ${title} - redirectTo: `, redirectTo);

        if (!home && isBackAction) {
            backAction();
        } else if (!home && redirectTo) {
            props.navigation.navigate(redirectTo);
        } else {
            props.navigation.navigate("Home", {
                screen: "Map"
            });
        }
    };

    useEffect(() => {
        console.log(`Header - ${title} - Update redirectTo with  `, text);
        setRedirectTo(text);
    }, [text]);

    useEffect(() => {
        console.log(`Header - ${title} - Update headerTitle with  `, title);
        setHeaderTitle(title);
    }, [title]);

    return <View style={headerStyles.root}>
        <View style={{height: 40}}>
            <StatusBar backgroundColor={COLORS.lightBlue} barStyle={"dark-content"}/>
        </View>
        <View>
            <View style={headerStyles.header}>
                <TouchableOpacity onPress={handleNavigation} activeOpacity={0.8}>
                    <FeatherIcon
                        name={!home ? "arrow-left" : "home"}
                        size={20}
                        color={COLORS.white}
                        style={headerStyles.icon}
                    />
                </TouchableOpacity>
                <TextAtom style={headerStyles.title}>{headerTitle}</TextAtom>
                <TouchableOpacity onPress={() => props.navigation.navigate("NotificationOption")} activeOpacity={0.8}>
                    <FeatherIcon
                        name={notification ? "settings" : null}
                        size={20}
                        color={COLORS.white}
                        style={headerStyles.icon}
                    />
                </TouchableOpacity>
            </View>
        </View>
    </View>;
};

export default Header;
