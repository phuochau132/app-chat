// SearchBar.js
import React from "react";
import { global_styles } from "../../../style";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

const Loading: React.FC = () => {
  return (
    <View style={global_styles.loadingContainer}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};
export default Loading;

// styles
