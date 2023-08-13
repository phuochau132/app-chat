import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { fontColor, global_styles, itemColor } from "../../../../style";
import Avatar from "../../../Component/Avatar";
import { useSelector } from "react-redux";
import moment from "moment";
import { useCallback } from "react";

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    backgroundColor: itemColor,
    padding: 5,
    borderRadius: 10,
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
  name: { fontWeight: "bold", fontSize: 16, color: fontColor },
  content_message: {
    opacity: 0.6,
    color: fontColor,
    overflow: "hidden",
  },
  status: {
    color: fontColor,
    opacity: 0.6,
    marginLeft: 15,
  },
  span: {
    color: fontColor,
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 2,
  },
});

const Item: React.FC<{ item: any }> = ({ item }) => {
  const navigation = useNavigation();
  const statusUser = useSelector((state: any) => {
    return state.user.statusUser;
  });
  const check = useCallback(() => {
    return statusUser.filter((tmp: any) => {
      return tmp.id === item.user.id && tmp.status == "offline";
    });
  }, [statusUser]);
  console.log("length", item.room.message.length);
  if (item.room.message[item.room.message.length - 1]) {
    console.log(item.room.message[item.room.message.length - 1].text);
  }
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("chat", { item: JSON.stringify(item) });
      }}
      style={[global_styles.rowCenter, styles.wrapper]}
    >
      <View>
        <Avatar user={item.user} size={{ width: 50, height: 50 }} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.user.nickName} </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.content_message}
        >
          {item.room.message.length > 0
            ? item.room.message[item.room.message.length - 1].text
            : "Gửi lời chào!"}
        </Text>
      </View>
      {statusUser.some((tmp: any) => {
        return tmp.id === item.user.id && tmp.status == "offline";
      }) && (
        <Text style={styles.content_message}>
          {moment(check()[0].createAt).fromNow()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Item;
