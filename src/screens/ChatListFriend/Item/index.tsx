import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { fontColor, global_styles, itemColor } from "../../../../style";
import Avatar from "../../../Component/Avatar";

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
  console.log(12398);
  console.log(item);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("chat", { item: JSON.stringify(item) });
      }}
      style={[global_styles.rowCenter, styles.wrapper]}
    >
      <View>
        <Avatar
          avatar={Constants.manifest.extra.HOST_SERVER + item.user.avatar}
          isActive={false}
          size={{ width: 50, height: 50 }}
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.user.nickName} </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.content_message}
        >
          {item.room.message.length > 0
            ? item.room.message[0].content
            : "Gửi lời chào!"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Item;
