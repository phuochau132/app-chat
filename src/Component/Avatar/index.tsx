// SearchBar.js
import React, { useCallback } from "react";
import { global_styles } from "../../../style";
import { Dimensions, View } from "react-native";
import { Image, Text } from "react-native-elements";
import { useSelector } from "react-redux";
import Constants from "expo-constants";
const Avatar: React.FC<{
  user: any;
  size: any;
}> = ({ user, size }) => {
  const statusUser = useSelector((state: any) => {
    return state.user.statusUser;
  });
  const mainUser = useSelector((state: any) => {
    return state.auth.user;
  });

  return (
    <View style={[global_styles.rowCenter]}>
      <Image
        source={{
          uri: user && user.avatar,
        }}
        style={{ borderRadius: 50, ...size }}
      ></Image>
      {(statusUser.some((item: any) => {
        return item.id === user.id && item.status == "online";
      }) ||
        (mainUser && user.id == mainUser.id)) && (
        <Text
          style={{
            position: "absolute",
            backgroundColor: "#31A24C",
            height: 10,
            width: 10,
            borderRadius: 100,
            bottom: 0,
            right: 0,
          }}
        ></Text>
      )}
    </View>
  );
};
export default Avatar;

// styles
