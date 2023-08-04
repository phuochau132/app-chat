import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  backgroundColor,
  fontColor,
  global_styles,
  itemColor,
} from "../../../../style";
import { useState } from "react";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const height = 130;
const width = 100;
const Item: React.FC<{
  event: any;
  item: any;
}> = ({ item, event }) => {
  console.log(98123);

  console.log(item);

  const navigation = useNavigation();
  const listImg = item.imgPosts;
  const [index, setIndex] = useState(1);
  const getLengthWidth = () => {
    if (listImg.length == 1) {
      return width;
    } else {
      return width / 2;
    }
  };
  const getLengthHeight = () => {
    if (listImg.length == 1) {
      return height;
    } else {
      return height / Math.ceil(listImg.length / 2);
    }
  };
  const toggleIndex = (index: Number) => [setIndex(Number)];
  return (
    <View
      style={[
        global_styles.ColumnCenter,
        {
          width: "100%",
          height: "auto",
          padding: 20,
          backgroundColor: itemColor,
          marginTop: 20,
          borderRadius: 20,
        },
      ]}
    >
      <View style={[global_styles.rowCenter]}>
        <View style={[global_styles.rowCenter]}>
          <Image
            source={{
              uri: process.env.HOST_SERVER + item.user.avatar,
            }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          ></Image>
        </View>
        <View
          style={[
            global_styles.ColumnCenter,
            { flex: 1, alignItems: "flex-start", marginLeft: 10 },
          ]}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: fontColor }}>
            {item.user.nickName}
          </Text>
          <Text style={{ opacity: 0.6, fontSize: 12, color: fontColor }}>
            {moment(item.createAt).fromNow()}
          </Text>
        </View>
      </View>
      <View
        style={[
          global_styles.rowCenter,
          {
            marginTop: 20,
            flexWrap: "wrap",
            height: 300,
          },
        ]}
      >
        {listImg.map((item, index) => {
          if (index < 3) {
            return (
              <View
                style={{
                  marginTop: 30,
                  width: `${getLengthWidth() - 2}%`,
                  height: `${getLengthHeight() - 2}%`,
                  marginRight: 2,
                  marginLeft: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  onPress={() => {
                    toggleIndex(index);
                  }}
                  source={{
                    uri: process.env.HOST_SERVER + item.urlImg,
                  }}
                  style={{
                    borderRadius: 10,
                    width: `100%`,
                    height: `100%`,
                    marginRight: 2,
                    marginLeft: 2,
                  }}
                ></Image>
              </View>
            );
          }
          if (index == 3) {
            return (
              <View
                style={{
                  position: "relative",
                  width: `${getLengthWidth() - 2}%`,
                  height: `${getLengthHeight() - 2}%`,
                  marginRight: 2,
                  marginLeft: 2,
                }}
              >
                <Image
                  onPress={() => {
                    toggleIndex(index);
                  }}
                  source={{
                    uri: item,
                  }}
                  style={{
                    borderRadius: 10,
                    width: `100%`,
                    height: `100%`,
                  }}
                >
                  <Text
                    style={{
                      position: "absolute",
                      color: "white",
                      top: 44,
                      left: 55,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {listImg.length - 4}
                  </Text>
                </Image>
              </View>
            );
          }
        })}
      </View>
      <View
        style={[
          global_styles.rowCenterBetween,
          { width: "95%", marginTop: 20 },
        ]}
      >
        <View style={[global_styles.rowCenter]}>
          <View style={[global_styles.rowCenter, { marginRight: 10 }]}>
            <Ionicons
              onPress={event}
              style={styles.icon}
              name="heart-outline"
            />
            <Text style={[global_styles.text]}>0</Text>
          </View>
          <View style={[global_styles.rowCenter, { marginRight: 10 }]}>
            <Ionicons name="chatbubble-ellipses-outline" style={styles.icon} />
            <Text style={[global_styles.text]}>0</Text>
          </View>
        </View>
        <View style={[global_styles.rowCenter]}>
          <Ionicons name="return-up-forward" style={styles.icon} />
        </View>
      </View>
    </View>
  );
};

export default Item;
