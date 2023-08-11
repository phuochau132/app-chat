import React, { FC, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "../../screens";
import { Image } from "react-native-elements";
import { Linking, StyleSheet, View } from "react-native";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";

import {
  getFriends,
  getRequestAddFriend,
  loadAllUser,
} from "../../redux/slice/userSlice";
import { tabRoutes } from "../../route";
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
const styles = StyleSheet.create({
  img: {
    width: 25,
    height: 25,
    borderRadius: 50,
  },
});
const Index: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log(123);

  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  const friends = useSelector((state: any) => {
    return state.user.friends;
  });
  useEffect(() => {
    dispatch(loadAllUser());
    dispatch(getRequestAddFriend(user.id));
    if (friends.length == 0) {
      dispatch(getFriends(user.id));
    }
  }, []);

  useEffect(() => {
    const handleNotification = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const url = initialUrl.split("://")[1];

        if (url === "YOUR_CLICK_ACTION") {
          navigation.navigate("home");
        }
      }
    };

    handleNotification();
    Linking.addEventListener("url", handleNotification);
    return () => {
      Linking.removeEventListener("url", handleNotification);
    };
  }, []);

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
              options={{
                headerShown: false,
                tabBarIcon: ({ size, focused }) => (
                  <Ionicons
                    key={index}
                    name={item.iconName}
                    size={size}
                    color={focused ? "white" : "gray"}
                  />
                ),
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
            tabBarIcon: ({ color, size, focused }) => (
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
                    uri:
                      user &&
                      Constants.manifest.extra.HOST_SERVER + user.avatar,
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
