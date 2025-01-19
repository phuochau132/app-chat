import { StyleSheet, Text, View } from "react-native";
import moment from "moment";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

import { fontColor, itemColor } from "../../../../../style";

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

  nickName: {
    opacity: 0.6,
    color: fontColor,
    overflow: "hidden",
  },
  status: {
    opacity: 0.6,
    marginLeft: 15,
    color: fontColor,
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
  name: {
    color: fontColor,
  },
});

const Item: React.FC<{ item: any; margin: any | undefined }> = ({
  item,
  margin,
}) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: itemColor,
          borderRadius: 10,
          padding: 5,
          marginLeft: margin,
        },
      ]}
    >
      <View>
        <Image
          source={{
            uri: item.user.avatar,
          }}
          style={styles.img}
        >
          {/* <View style={styles.span}></View> */}
        </Image>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.user.name} </Text>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nickName}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.status}>{moment(item.createAt).fromNow()} </Text>
    </View>
  );
};

export default Item;
