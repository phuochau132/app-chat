import React, { FC } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Home, Profile } from "../../pages";
import { Avatar } from "@rneui/themed";

const Tab = createBottomTabNavigator();

const Index: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          tabBarLabel: "",
        }}
      >
        {(props) => <Home />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
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
