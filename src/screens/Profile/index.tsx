import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useSelector } from "react-redux";

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
const Index: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  console.log(1978123);
  console.log(process.env.HOST_SERVER + user.avatar);

  return (
    <View style={global_styles.wrapper}>
      {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
      <View style={global_styles.rowCenterBetween}>
        <View style={global_styles.rowCenter}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {user.nickName}
          </Text>
          <Ionicons name="chevron-down-outline" size={30} color="black" />
        </View>
        <View style={global_styles.rowCenterBetween}>
          <Ionicons
            style={{ marginRight: 10 }}
            name="add-circle-outline"
            size={30}
            color="black"
          />

          <Ionicons name="menu-outline" size={30} color="black" />
        </View>
      </View>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <View style={global_styles.ColumnCenter}>
          <Image
            source={{
              uri: process.env.HOST_SERVER + user.avatar,
            }}
            style={styles.img}
          />
          <Text style={{ fontWeight: "bold", marginTop: 5 }}>{user.name}</Text>
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("editProfile");
          }}
          style={[global_styles.touchBtn]}
        >
          <Text
            style={{ width: 140, fontWeight: "bold" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Chỉnh sửa trang cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[global_styles.touchBtn]}>
          <Text
            style={{ width: 140, fontWeight: "bold" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Chia sẻ trang cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[global_styles.touchBtn]}>
          <Ionicons name="person-add" size={17} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
