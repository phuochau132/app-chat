import { Avatar, Button } from "@rneui/themed";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { blueColor, fontColor, global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import PushNotification from "react-native-push-notification";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

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
const UserProfile: React.FC<{ item: any; eventOnClose: any }> = ({
  item,
  eventOnClose,
}) => {
  const navigator = useNavigation();
  const dispatch = useDispatch();
  console.log(item);

  const [loading, setLoading] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  const userRequestAddFriend = useSelector((state: any) => {
    return state.user.listRequestAddFriend;
  });
  const handleAddFriend = () => {
    dispatch(addFriend({ userSend: user, userReceive: item }));
  };
  const check: any = useCallback(() => {
    userRequestAddFriend.filter((item: any) => {
      return item.userReceive.id == item.id;
    });
  }, [userRequestAddFriend]);
  const userFriend = check();
  return (
    <LinearGradientWrapper>
      <View>
        {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
        <View style={global_styles.rowCenterBetween}>
          <View style={global_styles.rowCenter}>
            <Ionicons
              onPress={eventOnClose}
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
                uri: Constants.manifest.extra.HOST_SERVER + item.avatar,
              }}
              style={styles.img}
            />
            <Text
              style={{ color: fontColor, fontWeight: "bold", marginTop: 5 }}
            >
              {item.fullName}
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
          {!userFriend && (
            <TouchableOpacity
              onPress={() => {
                handleAddFriend();
              }}
              style={[global_styles.touchBtn, { backgroundColor: "black" }]}
            >
              <View style={[{ width: 140 }, global_styles.rowCenter]}>
                <Ionicons name="person-add-outline" color="white" size={17} />
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
                  Thêm bạn bè
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {userFriend && userFriend[0].status == 1 && (
            <TouchableOpacity
              onPress={() => {
                setIsFriend(!isFriend);
              }}
              style={[global_styles.touchBtn]}
            >
              <View style={[{ width: 140 }, global_styles.rowCenter]}>
                <Ionicons
                  name="person-add-outline"
                  color={fontColor}
                  size={17}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: { fontColor },
                    marginLeft: 5,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Bạn bè
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {userFriend && userFriend[0].status == 0 && (
            <TouchableOpacity
              onPress={() => {
                setIsFriend(!isFriend);
              }}
              style={[global_styles.touchBtn]}
            >
              <View style={[{ width: 140 }, global_styles.rowCenter]}>
                <Ionicons
                  name="person-add-outline"
                  color={fontColor}
                  size={17}
                />
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    color: { fontColor },
                    marginLeft: 5,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Hủy kết bạn
                </Text>
              </View>
            </TouchableOpacity>
          )}
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
