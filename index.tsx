// App.tsx
import React, { useEffect, useRef, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { publicRoutes } from "./src/route";
import { useDispatch } from "react-redux";

import SockJS from "sockjs-client";
import Constants from "expo-constants";
import { over } from "stompjs";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getInfoUserFToken } from "./src/redux/slice/authSlice";
import { AppDispatch } from "./src/redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

export var stompClient: any = null;
const Index: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const connect = () => {
    let Sock = new SockJS(
      `${Constants.manifest?.extra?.HOST_SERVER}/gs-guide-websocket`
    );
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
    const accessToken: string | null = await AsyncStorage.getItem(
      "accessToken"
    );
    if (accessToken) {
      dispatch(getInfoUserFToken(accessToken));
    }
  };
  useEffect(() => {
    connect();
    checkToken();
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

export default Index;
