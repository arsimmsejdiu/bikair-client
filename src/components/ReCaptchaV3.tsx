import {getInvisibleRecaptchaContent, patchPostMessageJsCode} from "@services/reCaptchaService";
import * as React from "react";
import {forwardRef, ReactElement, RefAttributes, useEffect} from "react";
import {View, ViewProps} from "react-native";
import {WebView, WebViewMessageEvent} from "react-native-webview";

interface Props extends ViewProps {
    captchaDomain: string
    onReceiveToken: (captchaToken: string) => void
    siteKey: string
    action: string
}

export const ReCaptchaV3: React.FC<Props & RefAttributes<WebView>> = forwardRef((
    {
        captchaDomain,
        onReceiveToken,
        siteKey,
        action,
    }, ref): ReactElement | null => {

    useEffect(() => {
        console.log("Open ReCaptchaV3");
        return () => {
            console.log("close ReCaptchaV3");
        };
    }, []);

    return (
        <View style={{flex: 0.0001, width: 0, height: 0}}>
            <WebView
                ref={ref}
                javaScriptEnabled
                originWhitelist={["*"]}
                automaticallyAdjustContentInsets
                mixedContentMode={"always"}
                injectedJavaScript={patchPostMessageJsCode}
                source={{
                    html: getInvisibleRecaptchaContent(siteKey, action),
                    baseUrl: captchaDomain
                }}
                onMessage={(e: WebViewMessageEvent) => {
                    onReceiveToken(e.nativeEvent.data);
                }}
                onError={event => console.log("ReCaptcha webview onError : ", event)}
                onHttpError={event => console.log("ReCaptcha webview onHttpError : ", event)}
                //opacity:0.99 and androidLayerType="software" are workaround to prevent crashes
                style={{
                    opacity: 0.99
                }}
                androidLayerType={"software"}
            />
        </View>
    );
});


//Usage

// const platform = {
//     isIOS: Platform.OS === "ios",
//     isAndroid: Platform.OS === "android",
//     isWeb: false
// };

// const refreshToken = () => {
//     if (platform.isIOS && typeof reCaptchaRef.current?.injectJavaScript !== "undefined") {
//         reCaptchaRef.current.injectJavaScript(getExecutionFunction("", "login"));
//     } else if (platform.isAndroid && typeof reCaptchaRef.current?.reload !== "undefined") {
//         reCaptchaRef.current.reload();
//     }
// };

// <ReCaptchaV3
//     ref={reCaptchaRef}
//     captchaDomain={"www.bik-air.com"}
//     siteKey={""}
//     onReceiveToken={onSubmit}
//     action={"submit"}/>
