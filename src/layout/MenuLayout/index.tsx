import React, { FC, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Home, Profile } from "../../screens";
import { Avatar } from "@rneui/themed";
import { Image } from "react-native-elements";
import { StyleSheet, View } from "react-native";

import { global_styles } from "../../../style";
import { useDispatch, useSelector } from "react-redux";
import { loadAllUser } from "../../redux/slice/userSlice";
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
  }, []);
  console.log();

  return (
    <Tab.Navigator>
      {tabRoutes.map((item, index) => {
        const Page = item.component;
        return (
          <Tab.Screen
            key={index}
            name={item.name}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={item.iconName} size={size} color={color} />
              ),
              tabBarLabel: "",
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
          tabBarIcon: ({ color, size }) => (
            <View
              style={[
                { padding: 1.5, backgroundColor: color, borderRadius: 50 },
              ]}
            >
              <Image
                source={{
                  uri: process.env.HOST_SERVER + user.avatar,
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
  );
};

export default Index;
