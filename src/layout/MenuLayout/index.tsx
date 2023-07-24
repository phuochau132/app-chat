import React, { FC, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Home, Profile } from "../../screens";
import { Avatar } from "@rneui/themed";
import { tabRoutes } from "../../route";
import { View } from "react-native";

import { global_styles } from "../../../style";
import { useDispatch } from "react-redux";
import { loadAllUser } from "../../redux/slice/userSlice";
import { Image } from "react-native-elements";

const Tab = createBottomTabNavigator();

const Index: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadAllUser());
  }, []);
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
    </Tab.Navigator>
  );
};

export default Index;
