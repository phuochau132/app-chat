import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import { btnBgr, fontColor, global_styles } from "../../../style";
import { Image } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";

import PostsModal from "./PostsModal";
import FriendsModal from "./FriendsModal";
import { getPostsByUser } from "../../redux/slice/postSlice";

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
  background: {
    height: "30%",
    width: "100%",
  },
  tabContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: fontColor,
    padding: 10,
  },
  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "60%",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: fontColor, // Assuming `fontColor` is defined
  },
  tabButtonText: {
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState<any[]>([]);
  const userPosts = useSelector((state: any) => state.post.userPosts);
  const [modalDisplay, setModalDisplayed] = useState<number>(-1);
  const user = useSelector((state: any) => {
    return state.auth.user;
  });

  const friends = useSelector((state: any) => {
    return state.user.friends;
  });

  const handleLogout = async () => {
    navigation.dispatch(StackActions.replace("login"));
    dispatch(logout());
    await AsyncStorage.removeItem("accessToken");
  };
  useEffect(() => {
    setPosts(userPosts);
  }, [userPosts]);

  const [activeTab, setActiveTab] = useState(0);
  useEffect(() => {
    dispatch(getPostsByUser(user.id));
  }, [activeTab]);
  const tabData = [
    {
      label: "Bạn bè",
      event: () => {
        setModalDisplayed(1);
      },
    },
    {
      label: "Bài đăng",
      event: () => {
        setModalDisplayed(0);
      },
    },
  ];
  const handleTabPress = (index: number) => {
    tabData[index].event();
    setActiveTab(index);
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = index === activeTab;
    const animatedScale = new Animated.Value(isActive ? 1.2 : 1);

    const handleTabPressWithAnimation = () => {
      handleTabPress(index);
      Animated.spring(animatedScale, {
        toValue: isActive ? 1 : 1.2,
        useNativeDriver: false,
      }).start();
    };

    return (
      <TouchableOpacity
        onPress={handleTabPressWithAnimation}
        style={[styles.tabButton, isActive && styles.activeTab]}
      >
        <Animated.Text
          style={[
            styles.tabButtonText,
            {
              color: isActive ? fontColor : "gray",
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.label}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradientWrapper>
      <View style={[global_styles.wrapper]}>
        {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
        <View style={[global_styles.rowCenterBetween]}>
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
                uri: user && user.avatar,
              }}
              style={styles.img}
            />
            <Text
              style={[
                global_styles.text,
                { fontWeight: "bold", marginTop: 10, fontSize: 20 },
              ]}
            >
              {user && user.fullName}
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
                {posts.length}
              </Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Bài viết
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
                {friends.filter((item: any) => item.status == 1).length}
              </Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Bạn bè
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
                {friends.filter((item: any) => item.status == 0).length}
              </Text>
              <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                Đã gửi lời mời
              </Text>
            </View>
          </View>
        </View>
        <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("editProfile");
            }}
            style={[
              global_styles.touchBtn,
              { backgroundColor: btnBgr, width: "50%" },
            ]}
          >
            <Text
              style={{
                width: "100%",
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
            style={[global_styles.touchBtn, { width: "50%" }]}
          >
            <Text
              style={[styles.text, { width: "100%", color: fontColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            global_styles.rowCenter,
            styles.tabContainer,
            { marginTop: 10 },
          ]}
        >
          <FlatList
            data={tabData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDisplay == 0}
      >
        <PostsModal
          userId={user && user.id}
          data={posts}
          event={() => {
            setModalDisplayed(-1);
          }}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalDisplay == 1}
      >
        <FriendsModal
          userId={user && user.id}
          event={() => {
            setModalDisplayed(-1);
          }}
        />
      </Modal>
    </LinearGradientWrapper>
  );
};

export default Index;
