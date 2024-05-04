import {CaptureButton} from "@components/AppCamera/CaptureButton";
import {LabelOverlay} from "@components/AppCamera/LabelOverlay";
import {QrCodeOverlay} from "@components/AppCamera/QrCodeOverlay";
import {StatusBarBlurBackground} from "@components/AppCamera/StatusBarBlurBackground";
import Loader from "@components/Loader";
import {useAppDispatch, useIsForeground} from "@hooks/index";
import {RequestCameraPermission} from "@permissions/CameraPermission";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import {errorOccured} from "@redux/reducers/events";
import {SAFE_AREA_PADDING} from "@services/constants";
import {appCameraStyles} from "@styles/CameraStyle";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {Linking, StatusBar, StyleSheet, Text, View, ViewProps} from "react-native";
import Reanimated, {runOnJS, useSharedValue,} from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {
    Camera,
    PhotoFile,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
    VideoFile
} from "react-native-vision-camera";
import {COLORS} from "@assets/constant";
import {bikePhotoStyles} from "@styles/BikeStatusInfoStyle";


const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
    zoom: true,
});

interface Props extends ViewProps {
    type?: "label" | "qrcode" | "photo" | null;
    captureEnabled?: boolean;
    onMediaCaptured?: (photo: PhotoFile | null) => void;
    onProcessorResult?: (result: any[]) => void;
    onBackAction?: () => void;
}

export const AppCamera: React.FC<Props> = (
    {
        type,
        captureEnabled,
        onMediaCaptured,
        onProcessorResult,
        onBackAction,
        ...props
    }): React.ReactElement => {
    const insets = useSafeAreaInsets();
    const camera = useRef<Camera>(null);
    const [cameraPermission, setCameraPermission] = useState<boolean>(false);
    const [isCameraInitialized, setIsCameraInitialized] = useState(false);
    const [mediaCaptured, setMediaCaptured] = useState<PhotoFile | null>(null);
    const isPressingButton = useSharedValue(false);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const {t} = useTranslation();

    // check if camera page is active
    const {hasPermission, requestPermission} = useCameraPermission();
    const isFocussed = useIsFocused();
    const isForeground = useIsForeground();
    const isActive = isFocussed && isForeground;
    const isCaptureEnabled = typeof captureEnabled === "undefined" ? true : captureEnabled;


    const onInitialized = useCallback(() => {
        console.log("Camera initialized!");
        setIsCameraInitialized(true);
    }, []);

    const [flash, setFlash] = useState<"off" | "on">("on");

    const dispatch = useAppDispatch();

    // camera format settings
    const device = useCameraDevice("back");

    console.log("hasPermission", hasPermission);

    const supportsFlash = device?.hasFlash ?? false;

    //#region Callbacks
    const setIsPressingButton = useCallback(
        (_isPressingButton: boolean) => {
            isPressingButton.value = _isPressingButton;
        },
        [isPressingButton],
    );
    // Camera callbacks
    const onError = useCallback((error: any) => {
        console.error(error);
        dispatch(errorOccured(error, "APP_CAMERA_ERROR"));
    }, []);


    const handleMediaCaptured = useCallback(
        (media: PhotoFile | VideoFile | null, type?: "video" | "photo") => {
            console.log(`Media (${type}) captured! ${JSON.stringify(media)}`);
            if (type === "photo") {
                setMediaCaptured(media as PhotoFile);
            } else {
                if (typeof onMediaCaptured !== "undefined") {
                    onMediaCaptured(null);
                }
            }
        }, [onMediaCaptured]);

    const handleMediaValidation = (photo: PhotoFile) => {
        if (typeof onMediaCaptured !== "undefined") {
            onMediaCaptured(photo);
            setMediaCaptured(null);
        }
    };

    const handleMediaCancellation = () => {
        setMediaCaptured(null);
    };

    const onFlashPressed = useCallback(() => {
        setFlash((f) => (f === "off" ? "on" : "off"));
    }, []);
    //#endregion

    if (device != null) {
        console.log(
            `Re-rendering camera page with ${isActive ? "active" : "inactive"} camera. ` +
            `Device: "${device.name}"` +
            `Flash: support flash ${device?.hasFlash} and flash active ${flash}`,
        );
    } else {
        console.log("re-rendering camera page without active camera");
    }

    const requestCameraPermission = useCallback(async () => {
        console.log("Requesting camera permission...", cameraPermission);
        const permission = await RequestCameraPermission();
        console.log(`Camera permission status: ${permission}`);

        if (!permission) await Linking.openSettings();
        setCameraPermission(permission);
    }, []);


    const codeScanner = useCodeScanner({
        codeTypes: ["qr"],
        onCodeScanned: (codes: any) => {
            if (typeof onProcessorResult !== "undefined") {
                runOnJS(onProcessorResult)(codes);
            }
        }
    });

    useEffect(() => {
        setCameraPermission(hasPermission);
    }, [hasPermission]);

    useFocusEffect(
        useCallback(() => {
            if (!cameraPermission) {
                requestCameraPermission();
            }
        }, []));

    useEffect(() => {
        //Simulate camera initialization taking 2 seconds
        const initializationTimeOut = setTimeout(() => {
            setIsCameraReady(true);
        }, 2000);

        //cleanup the timeout if the component unmounts
        return () => clearTimeout(initializationTimeOut);
    }, []);

    useEffect(() => {
        if (camera.current) {
            console.log("Camera.current --> ", camera.current);
        }
    }, [camera]);

    if (!cameraPermission) {
        return (
            <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
                <Text>{t("camera.authorize_camera")}</Text>
            </View>
        );
    }

    if (device == null) {
        return <View style={{flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
            <Text>No device found</Text>
        </View>;
    }

    return (
        <View style={appCameraStyles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle={"light-content"}/>
            {isCameraReady ? (
                <Text>Camera is ready</Text>
            ) : (
                <Loader color={COLORS.lightBlue} style={bikePhotoStyles.root} size={"large"}/>
            )}
            {device != null && (
                <Reanimated.View style={StyleSheet.absoluteFill}>
                    {(isCameraReady && cameraPermission) && (
                        <ReanimatedCamera
                            ref={camera}
                            style={StyleSheet.absoluteFill}
                            device={device}
                            torch={flash}
                            fps={30}
                            isActive={isActive}
                            onInitialized={onInitialized}
                            onError={onError}
                            enableZoomGesture={false}
                            photo={type === "photo" || type === "label"}
                            video={false}
                            orientation="portrait"
                            codeScanner={type === "qrcode" ? codeScanner : undefined}
                        />
                    )}

                </Reanimated.View>
            )}

            <StatusBarBlurBackground/>

            <QrCodeOverlay
                visible={type === "qrcode"}
                supportsFlash={supportsFlash}
                onFlashPressed={onFlashPressed}
                onBackAction={onBackAction}
                flash={flash}
            />
            <LabelOverlay
                mediaCaptured={mediaCaptured}
                onCancel={handleMediaCancellation}
                onValidate={handleMediaValidation}
                onBackAction={onBackAction}
                media={mediaCaptured}
                visible={type === "label"}
                supportsFlash={supportsFlash}
                onFlashPressed={onFlashPressed}
                flash={flash}
            />

            {!mediaCaptured && (
                isCameraReady && (
                    <CaptureButton
                        style={[appCameraStyles.captureButton, {bottom: SAFE_AREA_PADDING(insets).paddingBottom}]}
                        camera={camera}
                        onMediaCaptured={handleMediaCaptured}
                        enabled={true}
                        setIsPressingButton={setIsPressingButton}
                        visible={isCaptureEnabled}
                    />
                )
            )}
            {props.children}
        </View>
    );
};
