// SearchBar.js
import React from "react";
import { global_styles } from "../../../style";
import { ActivityIndicator, Text } from "react-native-paper";
import { Dimensions, View } from "react-native";
import Constants from "expo-constants";
import { Image } from "react-native-elements";
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
const Avatar: React.FC<{
  avatar: string;
  isActive: boolean;
}> = ({ avatar, isActive }) => {
  return (
    <View style={[global_styles.rowCenter]}>
      <Image
        source={{
          uri: avatar,
        }}
        style={{ width: 40, height: 40, borderRadius: 50 }}
      ></Image>
      {isActive && (
        <Text
          style={{
            position: "absolute",
            backgroundColor: "#31A24C",
            height: "20%",
            width: "20%",
            borderRadius: 100,
            bottom: "0%",
            right: "5%",
          }}
        ></Text>
      )}
    </View>
  );
};
export default Avatar;

// styles
