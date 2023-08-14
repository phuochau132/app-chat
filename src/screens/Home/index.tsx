import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";

import {
  blueColor,
  fontColor,
  fontColorItem,
  global_styles,
  greyColor,
  itemColor,
} from "../../../style";
import Item from "./Item";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
import { Button } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addPost, getPosts } from "../../redux/slice/postSlice";
import Loading from "../../Component/Loading";
import LikesModal from "./LikeModal";
import CommentModal from "./CommentModal";

export let ScreenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  title: {
    color: fontColor,
    fontSize: 30,
    fontWeight: "bold",
  },
  item: {
    width: 100,
    display: "flex",
    textAlign: "center",
  },
  wrapperItem: {
    height: 70,
    width: 70,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(128, 195, 161, 1)",
  },
  wrapperImgItem: {
    borderColor: blueColor,
  },
  subItem: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: itemColor,
    overflow: "hidden",
  },
  text: {
    width: 60,
    color: fontColor,
    textAlign: "center",
  },
  img: {
    width: 50,
    height: 50,
  },

  inputPost: {
    color: "white",
    fontSize: 18,
    flex: 1,
    marginRight: 20,
    flexWrap: "wrap",
  },
  statusPost: {
    padding: 5,
  },
});
const Index: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isModalLikesVisible, setModalLikesVisible] = useState<boolean>(false);
  const [isCommentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [idPost, setIdPost] = useState<number>();
  const [textContent, setTextContent] = useState<string>("");
  const [statusModalPost, setStatusModalPost] = useState<boolean>(false);
  const [images, setImages] = useState<string[] | undefined>([]);
  const auth = useSelector((state: any) => {
    return state.auth;
  });
  const status = useSelector((state: any) => {
    return state.post.status;
  });
  useEffect(() => {
    dispatch(getPosts(Number.MAX_SAFE_INTEGER));
  }, []);
  const posts = useSelector((state: any) => {
    return state.post.posts;
  });

  const [statusPostCurrent, setStatusPostCurrent] = useState({
    index: 0,
    label: "Công khai",
    icon: "earth-outline",
  });
  const [statusPost, setStatusPost] = useState({
    index: 0,
    label: "Công khai",
    icon: "earth-outline",
  });
  const items = [
    { label: "Công khai", icon: "earth-outline" },
    { label: "Bạn bè", icon: "people-outline" },
    { label: "Chỉ mình tôi", icon: "person-outline" },
  ];
  const changeChangeText = (text: string) => {
    setTextContent(text);
  };
  const handleSelectStatus = () => {
    setStatusPost(statusPostCurrent);
    setStatusModalPost(false);
  };
  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Sorry, we need camera roll permissions to upload an image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setImages((prevImages: string) => [...prevImages, imageUri]);
    }
  };
  const handleAddPost = () => {
    if (auth.user) {
      dispatch(
        addPost({
          idUser: auth.user.id,
          text: textContent,
          files: images,
          statusPost,
        })
      );
      navigation.dispatch(StackActions.replace("home"));
    }
  };
  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 20;
    if (isBottom && contentOffset.y > 0) {
      const minId = posts.reduce(
        (min: any, post: any) => (post.id < min ? post.id : min),
        Number.MAX_SAFE_INTEGER
      );
      dispatch(getPosts(minId));
    }
  };
  return (
    <LinearGradientWrapper>
      <View style={[global_styles.wrapper]}>
        {status == "loading" && <Loading />}
        <View>
          <View style={[global_styles.rowCenterBetween, { width: 310 }]}>
            <Ionicons name="grid-outline" size={25} color={fontColor} />
            <Text style={styles.title}>Home</Text>
            <Ionicons
              onPress={() => {
                navigation.goBack;
              }}
              name="logo-twitch"
              size={25}
              color={fontColor}
            />
          </View>
        </View>
        <ScrollView
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={[global_styles.ColumnCenter, { marginTop: 30 }]}>
            {/* //123 */}
            <View
              style={[
                global_styles.ColumnCenter,
                { height: 200, alignItems: "flex-start" },
              ]}
            >
              <View
                style={[
                  global_styles.rowCenter,
                  { paddingTop: 10, paddingBottom: 10 },
                ]}
              >
                <Image
                  source={{
                    uri:
                      Constants.manifest.extra.HOST_SERVER + auth.user.avatar,
                  }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                ></Image>
                <TextInput
                  onPressIn={() => {
                    setModalVisible(!isModalVisible);
                  }}
                  caretHidden={true}
                  placeholderTextColor={fontColorItem}
                  focusable={false}
                  style={global_styles.textInput}
                  selectionColor={fontColorItem}
                  placeholder="Bạn đang nghĩ gì?"
                />
              </View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={[
                    global_styles.ColumnCenter,
                    {
                      marginRight: 15,
                    },
                  ]}
                >
                  <View
                    style={[
                      global_styles.rowCenter,
                      styles.wrapperItem,
                      { borderColor: itemColor },
                    ]}
                  >
                    <View style={[global_styles.rowCenter, styles.subItem]}>
                      <Ionicons
                        name="add-outline"
                        size={20}
                        color={fontColor}
                      />
                    </View>
                  </View>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Add Story
                  </Text>
                </View>
                <View style={[global_styles.ColumnCenter, { marginRight: 15 }]}>
                  <View
                    style={[
                      global_styles.rowCenter,
                      styles.wrapperItem,
                      styles.wrapperImgItem,
                    ]}
                  >
                    <View style={[global_styles.rowCenter, styles.subItem]}>
                      <Image
                        source={{
                          uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
                        }}
                        style={styles.img}
                      ></Image>
                    </View>
                  </View>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Add Story
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={global_styles.ColumnCenter}>
            {posts.map((item: any, index: number) => {
              return (
                <Item
                  key={index}
                  item={item}
                  eventOnLikesModal={(id: number) => {
                    setIdPost(id);
                    setModalLikesVisible(!isModalLikesVisible);
                  }}
                  eventOnCommentModal={(id: number) => {
                    setIdPost(id);
                    setCommentModalVisible(!isCommentModalVisible);
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={statusModalPost}
        >
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(128, 128, 128, 0.5)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <View
              style={[
                {
                  width: ScreenWidth,
                  height: "50%",
                  backgroundColor: "white",
                },
              ]}
            >
              <View
                style={[
                  global_styles.rowCenterBetween,
                  {
                    borderWidth: 0.5,
                    borderColor: "white",
                    borderBottomColor: itemColor,
                    padding: 10,
                  },
                ]}
              >
                <Ionicons
                  onPress={() => {
                    setStatusModalPost(false);
                  }}
                  name="arrow-back-outline"
                  size={20}
                  color="black"
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Đối tượng của bài viết
                </Text>
                <View></View>
              </View>
              <View style={{ marginBottom: "10%" }}>
                {items.map((item, index) => {
                  if (statusPostCurrent.label == item.label) {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setStatusPostCurrent({
                            index: index,
                            label: item.label,
                            icon: item.icon,
                          });
                        }}
                        key={index}
                        style={[
                          {
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            padding: 10,
                            backgroundColor: itemColor,
                            marginTop: 10,
                          },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color={fontColor}
                        />
                        <Text
                          style={{
                            fontSize: 15,
                            color: { fontColor },
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setStatusPostCurrent({
                          index: index,
                          label: item.label,
                          icon: item.icon,
                        });
                      }}
                      key={index}
                      style={[
                        {
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "flex-start",
                          padding: 10,
                          backgroundColor: "white",
                          marginTop: 10,
                        },
                      ]}
                    >
                      <Ionicons name={item.icon} size={20} color="black" />
                      <Text
                        style={{
                          fontSize: 15,
                          color: { fontColor },
                          fontWeight: "bold",
                          marginLeft: 10,
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Button title="Đồng ý" onPress={handleSelectStatus} />
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
        >
          {/* Modal post */}
          <LinearGradientWrapper>
            <View style={[global_styles.wrapper, { paddingTop: 0 }]}>
              <View style={global_styles.rowCenterBetween}>
                <View style={global_styles.rowCenter}>
                  <Ionicons
                    onPress={() => {
                      setModalVisible(!isModalVisible);
                    }}
                    name="arrow-back-outline"
                    style={global_styles.icon}
                  />
                  <Text
                    style={[
                      global_styles.text,
                      { fontSize: 17, fontWeight: "bold" },
                    ]}
                  >
                    Tạo bài viết
                  </Text>
                </View>
                <TouchableOpacity onPress={handleAddPost}>
                  <Text
                    style={{
                      color: blueColor,
                      fontSize: 17,
                      fontWeight: "bold",
                    }}
                  >
                    Chia sẻ
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  global_styles.rowCenter,
                  {
                    marginTop: 20,
                    justifyContent: "flex-start",
                  },
                ]}
              >
                <Image
                  source={{
                    uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
                  }}
                  style={{ width: 40, height: 40, borderRadius: 50 }}
                ></Image>
                <View style={[global_styles.ColumnCenter, { marginLeft: 5 }]}>
                  <Text
                    style={[
                      global_styles.text,
                      {
                        fontSize: 15,
                        fontWeight: "bold",
                        width: "100%",
                      },
                    ]}
                  >
                    Phước Hậu
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusModalPost(true);
                    }}
                    style={[
                      global_styles.rowCenter,
                      {
                        backgroundColor: itemColor,
                        borderRadius: 5,
                        marginTop: 5,
                        padding: 5,
                        paddingTop: 2,
                        paddingBottom: 2,
                      },
                    ]}
                  >
                    <Ionicons
                      name={statusPost.icon}
                      size={18}
                      color={fontColor}
                    />
                    <Text
                      style={{ color: "white", marginLeft: 5, marginRight: 5 }}
                    >
                      {statusPost.label}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      style={[global_styles.icon, { fontSize: 17 }]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
                <TextInput
                  style={styles.inputPost}
                  onChangeText={changeChangeText}
                  value={textContent}
                  placeholder="Bạn đang nghĩ gì..."
                  placeholderTextColor={greyColor}
                  selectionColor="white"
                />
                <View>
                  <Ionicons
                    onPress={handleImageUpload}
                    name="image-outline"
                    style={[
                      global_styles.icon,
                      { fontSize: 20, color: "#45bd62" },
                    ]}
                  />
                </View>
              </View>
              <View
                style={[
                  global_styles.rowCenter,
                  { marginTop: 20, flexWrap: "wrap" },
                ]}
              >
                {images &&
                  images.map((item, index) => {
                    return (
                      <Image
                        key={index}
                        source={{
                          uri: item,
                        }}
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 10,
                          marginRight: 10,
                          marginTop: 10,
                        }}
                      ></Image>
                    );
                  })}
              </View>
            </View>
          </LinearGradientWrapper>

          {/* Modal heart */}
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalLikesVisible}
        >
          <LikesModal
            idPost={idPost}
            event={() => {
              setModalLikesVisible(!isModalLikesVisible);
            }}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCommentModalVisible}
        >
          <CommentModal
            idPost={idPost}
            event={() => {
              setCommentModalVisible(!isCommentModalVisible);
            }}
          />
        </Modal>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
