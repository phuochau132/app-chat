// SearchBar.js
import React from "react";
import { global_styles } from "../../../style";
import { ActivityIndicator } from "react-native-paper";
import { Dimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const LinearGradientWrapper: React.FC<{ children: any }> = ({ children }) => {
  return (
    <View style={{ width: ScreenWidth, height: ScreenHeight }}>
      <LinearGradient
        colors={["#6A6257", "#5A544A", "#302D28"]}
        style={{ width: "100%", height: "100%", padding: 10 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
};
export default LinearGradientWrapper;

// styles
