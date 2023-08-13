import React, { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";

import { store } from "./src/redux";
import Index from "./index";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Linking } from "react-native";
import * as Notifications from "expo-notifications";
import { StyleSheet } from "react-native";
import BackgroundTimer from "react-native-background-timer";
import { AppState } from "react-native";
const styles = StyleSheet.create({});

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer
          linking={{
            config: {
              // Configuration for linking
            },
            async getInitialURL() {
              // First, you may want to do the default deep link handling
              // Check if app was opened from a deep link
              const url = await Linking.getInitialURL();

              if (url != null) {
                return url;
              }

              // Handle URL from expo push notifications
              const response =
                await Notifications.getLastNotificationResponseAsync();

              return response?.notification.request.content.data.url;
            },
            subscribe(listener) {
              const onReceiveURL = ({ url }: { url: string }) => listener(url);

              // Listen to incoming links from deep linking
              const eventListenerSubscription = Linking.addEventListener(
                "url",
                onReceiveURL
              );

              // Listen to expo push notifications
              const subscription =
                Notifications.addNotificationResponseReceivedListener(
                  (response) => {
                    const url = response.notification.request.content.data.url;

                    // Any custom logic to see whether the URL needs to be handled
                    //...

                    // Let React Navigation handle the URL
                    listener(url);
                  }
                );

              return () => {
                // Clean up the event listeners
                eventListenerSubscription.remove();
                subscription.remove();
              };
            },
          }}
        >
          <Index />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
