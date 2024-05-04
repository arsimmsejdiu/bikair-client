import {useAppDispatch} from "@hooks/index";
import {errorOccured} from "@redux/reducers/events";
import {captureButtonStyles} from "@styles/CameraStyle";
import React, {useCallback, useRef} from "react";
import {Platform, View, ViewProps} from "react-native";
import {State, TapGestureHandler, TapGestureHandlerStateChangeEvent,} from "react-native-gesture-handler";
import Reanimated, {useSharedValue,} from "react-native-reanimated";
import type {Camera, PhotoFile, TakePhotoOptions, VideoFile} from "react-native-vision-camera";

interface Props extends ViewProps {
    camera: React.RefObject<Camera>;
    onMediaCaptured: (media: PhotoFile | VideoFile | null, type?: "photo" | "video") => void;

    enabled: boolean;
    visible: boolean;

    setIsPressingButton: (isPressingButton: boolean) => void;
}

const _CaptureButton: React.FC<Props> = (
    {
        camera,
        onMediaCaptured,
        enabled,
        visible,
        setIsPressingButton,
        style,
        ...props
    }): React.ReactElement | null => {

    const takePhotoOptions: TakePhotoOptions = {
        qualityPrioritization: "speed"
    };
    const isPressingButton = useSharedValue(false);
    const dispatch = useAppDispatch();

    //#region Camera Capture
    const takePhoto = useCallback(async () => {
        try {
            if (camera.current === null) {
                dispatch(errorOccured("Camera ref is null", "CAMERA_CAPTURE_ERROR"));
                onMediaCaptured(null);
                return;
            }

            console.log("Taking photo...");
            let photo;
            if (Platform.OS === "ios") {
                photo = await camera.current.takePhoto(takePhotoOptions);
            } else {
                photo = await camera.current.takePhoto(takePhotoOptions);
            }

            onMediaCaptured(photo, "photo");
        } catch (e) {
            console.error("Failed to take photo!", e);
            dispatch(errorOccured(e, "TAKE_PHOTO_ERROR"));
        }
    }, [camera, onMediaCaptured, takePhotoOptions]);

    //#region Tap handler
    const tapHandler = useRef<TapGestureHandler>();
    const onHandlerStateChanged = useCallback(
        async ({nativeEvent: event}: TapGestureHandlerStateChangeEvent) => {
            // This is the gesture handler for the circular "shutter" button.
            // Once the finger touches the button (State.BEGAN), a photo is being taken and "capture mode" is entered. (disabled tab bar)
            // Also, we set `pressDownDate` to the time of the press down event, and start a 200ms timeout. If the `pressDownDate` hasn't changed
            // after the 200ms, the user is still holding down the "shutter" button. In that case, we start recording.
            //
            // Once the finger releases the button (State.END/FAILED/CANCELLED), we leave "capture mode" (enable tab bar) and check the `pressDownDate`,
            // if `pressDownDate` was less than 200ms ago, we know that the intention of the user is to take a photo. We check the `takePhotoPromise` if
            // there already is an ongoing (or already resolved) takePhoto() call (remember that we called takePhoto() when the user pressed down), and
            // if yes, use that. If no, we just try calling takePhoto() again
            console.debug(`state: ${Object.keys(State)[event.state]}`);
            switch (event.state) {
                case State.BEGAN: {
                    setIsPressingButton(true);
                    await takePhoto();
                    // console.log("sending photo ---> ");
                    return;
                }
                case State.END:
                case State.FAILED:
                case State.CANCELLED: {
                    setIsPressingButton(false);
                    return;
                }
                default:
                    break;
            }
        },
        [isPressingButton, setIsPressingButton, takePhoto],
    );
    //#endregion

    if (!visible) return null;

    return (
        <TapGestureHandler
            enabled={enabled}
            ref={tapHandler}
            onHandlerStateChange={onHandlerStateChanged}
            shouldCancelWhenOutside={false}
            maxDurationMs={99999999} // <-- this prevents the TapGestureHandler from going to State.FAILED when the user moves his finger outside the child view (to zoom)
        >
            <Reanimated.View {...props} style={[style]}>
                <Reanimated.View style={captureButtonStyles.flex}>
                    <Reanimated.View style={[captureButtonStyles.shadow]}/>
                    <View style={captureButtonStyles.button}>
                        <View style={captureButtonStyles.innerButton}/>
                    </View>
                </Reanimated.View>
            </Reanimated.View>
        </TapGestureHandler>
    );
};

export const CaptureButton = React.memo(_CaptureButton);
