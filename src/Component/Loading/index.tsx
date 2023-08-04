// SearchBar.js
import React from "react";
import { global_styles } from "../../../style";
import { ActivityIndicator } from "react-native-paper";
import { View } from "react-native";

const Loading: React.FC = () => {
  return (
    <View style={[global_styles.loadingContainer, { zIndex: 1000 }]}>
      <ActivityIndicator size="large" color="black" />
    </View>
  );
};
export default Loading;

// styles
