// SearchBar.js
import React from "react";
import { global_styles } from "../../../style";
import { Dimensions, View } from "react-native";
import { Image } from "react-native-elements";
const Avatar: React.FC<{
  avatar: string;
  isActive: boolean;
  size: any;
}> = ({ avatar, isActive, size }) => {
  return (
    <View style={[global_styles.rowCenter]}>
      <Image
        source={{
          uri: avatar,
        }}
        style={{ borderRadius: 50, ...size }}
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
