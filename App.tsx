// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { styled } from "styled-components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { publicRoutes } from "./src/route";

import { Avatar } from "@rneui/themed";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Home, Profile } from "./src/pages";

const styles = StyleSheet.create({
  container: { paddingTop: 30 },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App: React.FC = () => {
  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
