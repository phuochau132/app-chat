import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
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
  name: {},
  content_message: {
    opacity: 0.6,

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
interface User {
  fullName: string;
  avatar: string | null;
  email: string | null;
}
const Item: React.FC<{ item: User }> = ({ item }) => {
  const navigation = useNavigation();
  console.log(`${process.env.HOST_SERVER}+${item.avatar}`);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("chat");
      }}
      style={styles.container}
    >
      <View>
        <Image
          source={{
            uri: `${process.env.HOST_SERVER}${item.avatar}`,
          }}
          style={styles.img}
        >
          {/* <View style={styles.span}></View> */}
        </Image>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.fullName} </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.content_message}
        >
          Have a nice new dayaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </Text>
      </View>
      <Text style={styles.status}>now </Text>
    </TouchableOpacity>
  );
};

export default Item;
