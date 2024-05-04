package com.bikair; // replace com.your-app-name with your app’s name

import android.content.Intent;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import im.crisp.client.ChatActivity;
import im.crisp.client.Crisp;
import im.crisp.client.data.SessionEvent;
import im.crisp.client.data.SessionEvent.Color;

public class CrispChat extends ReactContextBaseJavaModule {
    private final ReactContext appContext;

    CrispChat(ReactApplicationContext context) {
        super(context);
        appContext = context;
    }

    // add to CalendarModule.java
    @Override
    public String getName() {
        return "CrispChat";
    }

    @ReactMethod
    public void setTokenId(String id) {
        Crisp.setTokenID(id);
    }

    @ReactMethod
    public void setUserEmail(String email) {
        Crisp.setUserEmail(email);
    }

    @ReactMethod
    public void setUserNickname(String name) {
        Crisp.setUserNickname(name);
    }

    @ReactMethod
    public void setUserPhone(String phone) {
        Crisp.setUserPhone(phone);
    }

    @ReactMethod
    public void setUserAvatar(String url) {
        Crisp.setUserAvatar(url);
    }

    @ReactMethod
    public void setSessionSegment(String segment) {
        Crisp.setSessionSegment(segment);
    }

    @ReactMethod
    public void setSessionString(String key, String value) {
        Crisp.setSessionString(key, value);
    }

    @ReactMethod
    public void setSessionBool(String key, Boolean value) {
        Crisp.setSessionBool(key, value);
    }

    @ReactMethod
    public void setSessionInt(String key, Integer value) {
        Crisp.setSessionInt(key, value);
    }

    @ReactMethod
    public void pushSessionEvent(String name, Integer color) {
        Color sessionEventColor;
        switch (color) {
            case 0:
                sessionEventColor = Color.RED;
                break;
            case 1:
                sessionEventColor = Color.ORANGE;
                break;
            case 2:
                sessionEventColor = Color.YELLOW;
                break;
            case 3:
                sessionEventColor = Color.GREEN;
                break;
            case 4:
                sessionEventColor = Color.BLUE;
                break;
            case 5:
                sessionEventColor = Color.PURPLE;
                break;
            case 6:
                sessionEventColor = Color.PINK;
                break;
            case 7:
                sessionEventColor = Color.BROWN;
                break;
            case 8:
                sessionEventColor = Color.GREY;
                break;
            case 9:
                sessionEventColor = Color.BLACK;
                break;
            default:
                sessionEventColor = Color.BLACK;
                break;
        }

        Crisp.pushSessionEvent(new SessionEvent(name, sessionEventColor));
    }

    @ReactMethod
    public void resetSession() {
        Crisp.resetChatSession(appContext);
    }

    @ReactMethod
    public void show() {
        Intent crispIntent = new Intent(appContext, ChatActivity.class);
        crispIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        appContext.startActivity(crispIntent);
    }
}
