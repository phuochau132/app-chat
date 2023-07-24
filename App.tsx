// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { styled } from "styled-components";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { publicRoutes } from "./src/route";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";

import { store } from "./src/redux";
import { TextEncoder, TextDecoder } from "fast-text-encoding";
import { loadAllUser } from "./src/redux/slice/userSlice";
import { TextInput } from "react-native-paper";

const styles = StyleSheet.create({
  container: { paddingTop: 30, backgroundColor: "white" },
});

const Stack = createStackNavigator();

// Use TextEncoder and TextDecoder as needed
// For example:
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}
const App: React.FC = () => {
  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default App;
