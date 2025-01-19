import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";

import { fontColor, itemColor } from "../../../../style";
import { useCallback } from "react";
import Avatar from "../../../Component/Avatar";
import moment from "moment";

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: itemColor,
    padding: 10,
    borderRadius: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: { color: fontColor },
  content_message: {
    opacity: 0.6,
    color: fontColor,
    overflow: "hidden",
  },
  status: {
    opacity: 0.6,
    marginLeft: 15,
  },
  span: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 2,
  },
});

const Item: React.FC<{ item: any; onPress: any }> = ({ item, onPress }) => {
  const statusUser = useSelector((state: any) => {
    return state.user.statusUser;
  });
  const check = useCallback(() => {
    return statusUser.filter((tmp: any) => {
      return tmp.id === item.id && tmp.status == "offline";
    });
  }, [statusUser]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View>
        <Avatar user={item} size={{ width: 50, height: 50 }} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName} </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.content_message}
        >
          {item.nickName}
        </Text>
      </View>
      {statusUser.some((tmp: any) => {
        return tmp.id === item.id && tmp.status == "offline";
      }) && (
        <Text style={styles.content_message}>
          {moment(check()[0].createAt).fromNow()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Item;
