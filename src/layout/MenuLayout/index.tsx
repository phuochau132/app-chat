import React, { FC, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Home, Profile } from "../../screens";
import { Avatar } from "@rneui/themed";
import { Image } from "react-native-elements";
import { StyleSheet, View } from "react-native";

import { global_styles, itemColor } from "../../../style";
import { useDispatch, useSelector } from "react-redux";
import { getAllFriend, loadAllUser } from "../../redux/slice/userSlice";
import { tabRoutes } from "../../route";

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
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  useEffect(() => {
    dispatch(loadAllUser());
    dispatch(getAllFriend(user.id));
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
                    uri: user && process.env.HOST_SERVER + user.avatar,
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
