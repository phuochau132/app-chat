import React, { FC, useEffect, useRef, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "../../screens";
import { Image } from "react-native-elements";
import { AppState, Linking, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";

import {
  getFriends,
  getRequestAddFriend,
  loadAllUser,
  setActiveUser,
} from "../../redux/slice/userSlice";
import { stompClient } from "../../../index";
import { tabRoutes } from "../../route";
import { useNavigation } from "@react-navigation/native";
import { global_styles } from "../../../style";

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  img: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
});
let check = false;
const Index: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  const friends = useSelector((state: any) => {
    return state.user.friends;
  });
  const initComponent = async () => {
    await dispatch(loadAllUser());
    if (friends.length == 0) {
      await dispatch(getFriends(user.id));
      await dispatch(getRequestAddFriend(user.id));
    }
  };
  useEffect(() => {
    initComponent();
  }, []);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  useEffect(() => {
    let isStompClientConnected = stompClient.connected;
    if (isStompClientConnected) {
      stompClient.send(
        `/app/users/status`,
        {},
        JSON.stringify({ id: user.id, createAt: null, status: "online" })
      );
      const subscribe = stompClient.subscribe(
        `/topic/users/status`,
        (data: any) => {
          dispatch(setActiveUser(JSON.parse(data.body)));
        }
      );
      const subscription = AppState.addEventListener(
        "change",
        (nextAppState) => {
          if (nextAppState === "active") {
            stompClient.send(
              `/app/users/status`,
              {},
              JSON.stringify({
                id: user.id,
                createAt: null,
                status: "online",
              })
            );
          } else {
            stompClient.send(
              `/app/users/status`,
              {},
              JSON.stringify({
                id: user.id,
                createAt: null,
                status: "offline",
              })
            );
          }
          appState.current = nextAppState;
          setAppStateVisible(appState.current);
        }
      );
      isStompClientConnected = false;
      check = true;
      return () => {
        subscription.remove();
        subscribe.unsubscribe();
      };
    }
  }, [stompClient.connected]);

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Tab.Navigator
        screenOptions={{
          tabBarHideOnKeyboard: true,
          tabBarShowLabel: false,
          tabBarStyle: [{ display: "flex", backgroundColor: "#5A544A" }, null],
        }}
      >
        {tabRoutes.map((item, index) => {
          const Page = item.component;
          return (
            <Tab.Screen
              key={index}
              name={item.name}
              listeners={{
                tabPress: (item) => {
                  if (item.target?.startsWith("requestAddFriend")) {
                    dispatch(getRequestAddFriend(user.id));
                  }
                  if (item.target?.startsWith("tabSearch")) {
                    dispatch(loadAllUser());
                  }
                  if (item.target?.startsWith("listFriend")) {
                    dispatch(getFriends(user.id));
                  }
                },
              }}
              options={{
                headerShown: false,
                tabBarIcon: ({ size, focused }) => {
                  return (
                    <Ionicons
                      key={index}
                      name={item.iconName}
                      size={size}
                      color={focused ? "white" : "gray"}
                    />
                  );
                },
              }}
            >
              {(props) => <Page />}
            </Tab.Screen>
          );
        })}
        <Tab.Screen
          name="tabProfile"
          options={{
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <View
                style={[
                  {
                    padding: 1.5,
                    backgroundColor: focused ? "white" : "gray",
                    borderRadius: 50,
                  },
                ]}
              >
                <Image
                  source={{
                    uri: user && user.avatar,
                  }}
                  style={[styles.img]}
                />
              </View>
            ),
            tabBarLabel: "",
          }}
        >
          {(props) => <Profile />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

export default Index;
