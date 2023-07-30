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
import { blueColor, global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import PushNotification from "react-native-push-notification";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

import { stompClient } from "../../../index";
import { addFriend } from "../../redux/slice/userSlice";

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  text: {
    width: 60,
    textAlign: "center",
  },
});
const Index: React.FC<{ item: any; eventOnClose: any }> = ({
  item,
  eventOnClose,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
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
  console.log(userRequestAddFriend);
  console.log(userFriend);
  console.log(12398);

  return (
    <View style={global_styles.wrapper}>
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
            color="black"
          />
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 30 }}>
            {item.nickName}
          </Text>
        </View>
        <Ionicons
          style={{ marginRight: 10 }}
          name="grid-outline"
          size={30}
          color="black"
        />
      </View>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <View style={global_styles.ColumnCenter}>
          <Image
            source={{
              uri: process.env.HOST_SERVER + item.avatar,
            }}
            style={styles.img}
          />
          <Text style={{ fontWeight: "bold", marginTop: 5 }}>
            {item.fullName}
          </Text>
        </View>
        <View style={[global_styles.ColumnCenter]}>
          <Text
            style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}
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
            style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}
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
            style={[global_styles.touchBtn, { backgroundColor: blueColor }]}
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
              <Ionicons name="person-add-outline" color="black" size={17} />
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
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
              <Ionicons name="person-add-outline" color="black" size={17} />
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "black",
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
          style={[global_styles.touchBtn, global_styles.rowCenter]}
        >
          <View style={{ width: 140, alignItems: "center" }}>
            <Text
              style={{
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
export default Index;
