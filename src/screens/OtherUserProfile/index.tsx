import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fontColor, global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useRoute } from "@react-navigation/native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

import { addFriend } from "../../redux/slice/userSlice";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";

const styles = StyleSheet.create({
  img: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  text: {
    width: 60,
    textAlign: "center",
    color: fontColor,
  },
});
const UserProfile: React.FC = () => {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { item } = route.params;
  const profileUser = JSON.parse(item);
  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  const friends = useSelector((state: any) => {
    return state.user.friends;
  });
  const handleAddFriend = () => {
    dispatch(addFriend({ senderId: user.id, receiverId: profileUser.id }));
  };
  const check = useCallback(() => {
    return friends.filter((tmp: any) => {
      return tmp.user.id == profileUser.id;
    });
  }, [friends]);
  console.log(friends);

  console.log(9812313);
  console.log(check());

  return (
    <LinearGradientWrapper>
      <View style={global_styles.wrapper}>
        {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
        <View style={global_styles.rowCenterBetween}>
          <View style={global_styles.rowCenter}>
            <Ionicons
              onPress={() => {
                console.log(123);
                navigator.navigate("tabSearch");
              }}
              name="arrow-back-outline"
              size={25}
              color={fontColor}
            />
            <Text
              style={{
                color: fontColor,
                fontSize: 20,
                fontWeight: "bold",
                marginLeft: 30,
              }}
            >
              {item.nickName}
            </Text>
          </View>
          <Ionicons
            style={{ marginRight: 10 }}
            name="grid-outline"
            size={30}
            color={fontColor}
          />
        </View>
        <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
          <View style={global_styles.ColumnCenter}>
            <Image
              source={{
                uri: Constants.manifest.extra.HOST_SERVER + profileUser.avatar,
              }}
              style={styles.img}
            />
            <Text
              style={{ color: fontColor, fontWeight: "bold", marginTop: 5 }}
            >
              {profileUser.fullName}
            </Text>
          </View>
          <View style={[global_styles.ColumnCenter]}>
            <Text
              style={{
                color: fontColor,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              2
            </Text>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              Bài viết
            </Text>
          </View>
          <View style={[global_styles.ColumnCenter]}>
            <Text
              style={[
                styles.text,
                { fontWeight: "bold", textAlign: "center", fontSize: 16 },
              ]}
            >
              2
            </Text>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              Người theo giỏi
            </Text>
          </View>
          <View style={[global_styles.ColumnCenter]}>
            <Text
              style={{
                color: fontColor,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
              }}
            >
              2
            </Text>
            <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
              Đang theo dõi
            </Text>
          </View>
        </View>
        <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
          <TouchableOpacity
            onPress={() => {
              {
                check().length === 0 && handleAddFriend();
              }
              {
                check().length > 0 && check()[0].status == 0 && "Hủy kết bạn";
              }
              {
                check().length > 0 && check()[0].status == 1 && "Bạn bè";
              }
            }}
            style={[global_styles.touchBtn, { backgroundColor: "black" }]}
          >
            <View style={[{ width: 140 }, global_styles.rowCenter]}>
              {check().length === 0 && (
                <Ionicons name="person-add-outline" color="white" size={17} />
              )}
              {/* {check().length > 0 && check()[0].status == 0 && "Hủy kết bạn"}
              {check().length > 0 && check()[0].status == 1 && "Bạn bè"} */}

              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "white",
                  marginLeft: 5,
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {check().length === 0 && "Thêm bạn bè"}
                {check().length > 0 && check()[0].status == 0 && "Hủy kết bạn"}
                {check().length > 0 && check()[0].status == 1 && "Bạn bè"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigator.navigate("chat");
            }}
            style={[global_styles.touchBtn, global_styles.rowCenter]}
          >
            <View style={{ width: 140, alignItems: "center" }}>
              <Text
                style={{
                  color: fontColor,
                  fontWeight: "bold",
                  textAlign: "center",
                  // Add any other styles you need
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Nhắn tin
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[global_styles.touchBtn]}>
            <Ionicons name="person-add-outline" size={17} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradientWrapper>
  );
};
async function sendPushNotification(user: any) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: user.expoPushToken,
      sound: "default",
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here" },
    }),
  });
}
export default UserProfile;
