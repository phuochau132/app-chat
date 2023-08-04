import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import { blueColor, btnBgr, fontColor, global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  text: {
    width: 60,
    textAlign: "center",
    color: fontColor,
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => {
    return state.auth.user;
  });

  const handleLogout = async () => {
    navigation.dispatch(StackActions.replace("login"));
    dispatch(logout());
    await AsyncStorage.removeItem("accessToken");
  };
  return (
    <LinearGradientWrapper>
      <View style={[global_styles.wrapper]}>
        {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
        <View style={global_styles.rowCenterBetween}>
          <View style={global_styles.rowCenter}>
            <Text
              style={[global_styles.text, { fontSize: 20, fontWeight: "bold" }]}
            >
              {user && user.nickName}
            </Text>
            <Ionicons name="chevron-down-outline" size={30} color={fontColor} />
          </View>
          <View style={global_styles.rowCenterBetween}>
            <Ionicons name="menu-outline" size={30} color={fontColor} />
          </View>
        </View>
        <View style={[global_styles.ColumnCenter, { marginTop: 20 }]}>
          <View style={global_styles.ColumnCenter}>
            <Image
              source={{
                uri: user && process.env.HOST_SERVER + user.avatar,
              }}
              style={styles.img}
            />
            <Text
              style={[
                global_styles.text,
                { fontWeight: "bold", marginTop: 10, fontSize: 20 },
              ]}
            >
              {user && user.name}
            </Text>
          </View>
          <View
            style={[
              global_styles.rowCenterBetween,
              {
                width: "100%",
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,
              },
            ]}
          >
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
                style={[
                  styles.text,
                  { fontWeight: "bold", textAlign: "center", fontSize: 16 },
                ]}
              >
                2
              </Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Đang theo dõi
              </Text>
            </View>
          </View>
        </View>
        <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("editProfile");
            }}
            style={[global_styles.touchBtn, { backgroundColor: btnBgr }]}
          >
            <Text
              style={{
                width: 140,
                fontWeight: "bold",
                color: "white",
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Chỉnh sửa trang cá nhân
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={[global_styles.touchBtn]}
          >
            <Text
              style={[styles.text, { width: 140, color: fontColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
