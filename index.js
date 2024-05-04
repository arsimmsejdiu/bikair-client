/**
 * @format
 */
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import {AppRegistry, LogBox} from "react-native";

import "./src/translation/i18n";
import App from "./App";
import {name as appName} from "./app.json";
import {onTapNotification} from "./src/services/FCMService";

LogBox.ignoreLogs([
    "SerializableStateInvariantMiddleware",
    "new NativeEventEmitter",
    "exported from 'deprecated-react-native-prop-types'.",
]); // Ignore log notification by message

// We need to initialiaze background handler to avoir warning
// @TODO fix unwanted Function
messaging().setBackgroundMessageHandler(async remoteMessage => remoteMessage);


// Handle tap event on notification-background
notifee.onBackgroundEvent(onTapNotification);

AppRegistry.registerComponent(appName, () => App);
