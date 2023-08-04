// App.tsx
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { publicRoutes } from "./src/route";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import { TextEncoder, TextDecoder } from "fast-text-encoding";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInfoUserFToken } from "./src/redux/slice/authSlice";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const styles = StyleSheet.create({});

const Stack = createStackNavigator();

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
export var stompClient: any = null;
const Index: React.FC = () => {
  const dispatch = useDispatch();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const connect = () => {
    let Sock = new SockJS(`${process.env.HOST_SERVER}/gs-guide-websocket`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };
  const onConnected = () => {
    console.log("Connect successfully");
  };
  const onError = () => {
    console.log("err");
  };
  const checkToken = async () => {
    const accessToken: any = await AsyncStorage.getItem("accessToken");
    if (accessToken) {
      dispatch(getInfoUserFToken(accessToken));
    }
  };
  useEffect(() => {
    connect();
    checkToken();
  }, []);
  useEffect(() => {
    registerForPushNotificationsAsync().then((token: any) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Stack.Navigator>
      {publicRoutes.map((item) => {
        const Layout = item.layout;
        const Page = item.component;
        return (
          <Stack.Screen
            options={{ headerShown: false }}
            key={item.name}
            name={item.name}
          >
            {(props) => (
              <Layout>
                <Page />
              </Layout>
            )}
          </Stack.Screen>
        );
      })}
    </Stack.Navigator>
  );
};

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log("Must use physical device for Push Notifications");
  }

  return token;
}

export default Index;
