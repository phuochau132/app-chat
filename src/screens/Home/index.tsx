import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Swiper from "react-native-swiper";
import { Image } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, useNavigation } from "@react-navigation/native";
import Toast from "react-native-simple-toast";
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
import { addPost, getPost } from "../../redux/slice/postSlice";
import Loading from "../../Component/Loading";
import LikesModal from "./LikeModal";
import CommentModal from "./CommentModal";
import * as Notifications from "expo-notifications";
import { uploadFiles } from "../../util/cloudary";
import { addStory, loadAllUser } from "../../redux/slice/userSlice";
import { AppDispatch } from "../../redux";
import Avatar from "../../Component/Avatar";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [isModalLikesVisible, setModalLikesVisible] = useState<boolean>(false);
  const [isModalStoryVisible, setModalStoryVisible] = useState<boolean>(false);
  const [isCommentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [idPost, setIdPost] = useState<number>();
  const [textContent, setTextContent] = useState<string>("");
  const [statusModalPost, setStatusModalPost] = useState<boolean>(false);
  const [statusStoryModal, setStatusStoryModal] = useState<boolean>(false);
  const [dataStoryModal, setDataStoryModal] = useState<any>();
  const [images, setImages] = useState<string[] | undefined>([]);
  const [storyImage, setStoryImage] = useState<string | undefined>();
  const notificationListener = useRef<any>(null);
  const [notification, setNotification] = useState(false);
  const responseListener = useRef<any>(null);
  const [userFiltered, setUserFiltered] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storyContent, setStoryContent] = useState<string>("");
  const [storyViewed, setStoryViewed] = useState<any>("");
  const listUser = useSelector((state: any) => {
    return state.user.listUser;
  });
  const auth = useSelector((state: any) => {
    return state.auth;
  });
  const filterUserByStory = async () => {
    const usersNotViewed: any = [];
    const usersViewed: any = [];
    const storedData = await AsyncStorage.getItem("storyViewed");
    const storyViewed = storedData ? JSON.parse(storedData) : {};
    listUser.forEach((userItem: any) => {
      if (userItem.stories.length > 0) {
        const checked = userItem.stories.some((story: any) => {
          return (
            !storyViewed[userItem.id] ||
            !storyViewed[userItem.id].includes(story.id)
          );
        });
        if (checked) {
          usersNotViewed.unshift(userItem);
        } else {
          usersViewed.push(userItem);
        }
      }
    });
    const allUsers = {
      notView: usersNotViewed,
      viewed: usersViewed,
    };
    setUserFiltered(allUsers);
  };
  useEffect(() => {
    if (listUser.length > 0) {
      filterUserByStory();
    }
  }, [listUser]);

  const status = useSelector((state: any) => {
    return state.post.status;
  });
  useEffect(() => {
    dispatch(getPost(Number.MAX_SAFE_INTEGER));
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification: any) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigation.navigate("chatListFriend");
      });
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
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
  const handleImageUpload = async (callback: any) => {
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
      callback(imageUri);
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
      dispatch(getPost(minId));
    }
  };
  const handleAddStory = async () => {
    setIsLoading(true);
    if (auth.user) {
      try {
        const status = statusPost.index;
        const image = storyImage;
        if (image && storyContent) {
          const fileUploaded: any = await uploadFiles({
            fileUris: [storyImage],
          });
          const imageResponse = fileUploaded[0];
          await dispatch(
            addStory({
              image: imageResponse,
              content: storyContent,
              status: status,
              userId: auth.user.id,
            })
          );
        } else {
          Toast.show("Vui lòng nhập đầy đủ thông tin!", Toast.LONG, {
            backgroundColor: "white",
            textColor: "black",
          });
        }
        setIsLoading(false);
        navigation.dispatch(StackActions.replace("home"));
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <LinearGradientWrapper>
      <View style={[global_styles.wrapper]}>
        {status == "loading" && <Loading />}
        <View style={[global_styles.rowCenterBetween]}>
          <Ionicons name="grid-outline" size={25} color={fontColor} />
          <Text style={styles.title}>Home</Text>
          <Ionicons
            onPress={() => {
              Linking.openURL("https://www.instagram.com/ph_hau56/");
            }}
            name="logo-twitch"
            size={25}
            color={fontColor}
          />
        </View>
        <ScrollView onScroll={handleScroll} showsVerticalScrollIndicator={true}>
          <View style={[global_styles.ColumnCenter, { marginTop: 30 }]}>
            <View
              style={[global_styles.ColumnCenter, { alignItems: "flex-start" }]}
            >
              <View
                style={[
                  global_styles.rowCenter,
                  { paddingTop: 10, paddingBottom: 10 },
                ]}
              >
                <Image
                  source={{
                    uri: auth.user && auth.user.avatar,
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
                style={{ maxHeight: 100 }}
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
                  <TouchableOpacity
                    onPress={() => {
                      setModalStoryVisible(!isModalStoryVisible);
                    }}
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
                  </TouchableOpacity>
                  <Text
                    style={styles.text}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Add Story
                  </Text>
                </View>
                {userFiltered.notView &&
                  userFiltered.notView.length > 0 &&
                  userFiltered.notView.map((user: any, index: number) => {
                    if (user.stories.length > 0) {
                      return (
                        <View
                          key={index}
                          style={[
                            global_styles.ColumnCenter,
                            { marginRight: 15 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={async () => {
                              // set data
                              setDataStoryModal(user);
                              setStatusStoryModal(true);
                              try {
                                const storyId = user.stories[0].id;
                                const userId = user.id;

                                const storedData = await AsyncStorage.getItem(
                                  "storyViewed"
                                );
                                const parsedData = storedData
                                  ? JSON.parse(storedData)
                                  : {};

                                if (!parsedData[userId]) {
                                  parsedData[userId] = [];
                                }

                                if (!parsedData[userId].includes(storyId)) {
                                  parsedData[userId].push(storyId);
                                }

                                await AsyncStorage.setItem(
                                  "storyViewed",
                                  JSON.stringify(parsedData)
                                );
                                setStoryViewed(parsedData);
                              } catch (error) {
                                console.error(
                                  "Error saving story viewed:",
                                  error
                                );
                              }
                              filterUserByStory();
                            }}
                          >
                            <View
                              style={[
                                global_styles.rowCenter,
                                styles.wrapperItem,
                                styles.wrapperImgItem,
                              ]}
                            >
                              <View
                                style={[
                                  global_styles.rowCenter,
                                  styles.subItem,
                                ]}
                              >
                                <Image
                                  source={{
                                    uri: user.avatar,
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
                              {user && user.fullName}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })}
                {userFiltered.viewed &&
                  userFiltered.viewed.length > 0 &&
                  userFiltered.viewed.map((user: any, index: number) => {
                    if (user.stories.length > 0) {
                      return (
                        <View
                          key={index}
                          style={[
                            global_styles.ColumnCenter,
                            { marginRight: 15 },
                          ]}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              // set data
                              setDataStoryModal(user);
                              setStatusStoryModal(true);
                            }}
                          >
                            <View
                              style={[
                                global_styles.rowCenter,
                                styles.wrapperItem,
                                styles.wrapperImgItem,
                                { borderColor: itemColor },
                              ]}
                            >
                              <View
                                style={[
                                  global_styles.rowCenter,
                                  styles.subItem,
                                ]}
                              >
                                <Image
                                  source={{
                                    uri: user.avatar,
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
                              {user && user.fullName}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }
                  })}
              </ScrollView>
            </View>
          </View>
          <View style={[global_styles.ColumnCenter, { paddingBottom: 40 }]}>
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
        {/* Story Preview Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={statusStoryModal}
        >
          <LinearGradientWrapper>
            <View>
              <View style={global_styles.rowStart}>
                <Ionicons
                  onPress={() => {
                    setStatusStoryModal(!statusStoryModal);
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
                  <View style={[global_styles.rowCenter, { marginBottom: 5 }]}>
                    <View style={[global_styles.rowCenter]}>
                      <Avatar
                        user={dataStoryModal && dataStoryModal}
                        size={{ width: 40, height: 40 }}
                      />
                    </View>
                    <View
                      style={[
                        global_styles.ColumnCenter,
                        { flex: 1, alignItems: "flex-start", marginLeft: 10 },
                      ]}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 16,
                          color: fontColor,
                        }}
                      >
                        {dataStoryModal && dataStoryModal.fullName}
                        {"'s Story"}
                      </Text>
                    </View>
                  </View>
                </Text>
              </View>
              {listUser.length > 0 && dataStoryModal && (
                <View
                  style={{
                    height: "80%",
                    marginTop: 50,
                  }}
                >
                  <Swiper
                    showsButtons={dataStoryModal.stories.length > 1}
                    scrollEnabled={true}
                    // autoplay={true}
                    // autoplayTimeout={5}
                    onIndexChanged={async (index) => {
                      try {
                        const user = dataStoryModal;
                        const storyId = user.stories[index].id;
                        const userId = user.id;
                        const storedData = await AsyncStorage.getItem(
                          "storyViewed"
                        );
                        const parsedData = storedData
                          ? JSON.parse(storedData)
                          : {};

                        if (!parsedData[userId]) {
                          parsedData[userId] = [];
                        }

                        if (!parsedData[userId].includes(storyId)) {
                          parsedData[userId].push(storyId);
                        }

                        await AsyncStorage.setItem(
                          "storyViewed",
                          JSON.stringify(parsedData)
                        );
                        setStoryViewed(parsedData);
                      } catch (error) {
                        console.error("Error saving story viewed:", error);
                      }
                      filterUserByStory();
                    }}
                    dot={
                      <View
                        style={{
                          backgroundColor: "lightgray",
                          width: 8,
                          height: 8,
                          borderRadius: 4,
                          margin: 3,
                        }}
                      />
                    }
                    activeDot={
                      <View
                        style={{
                          backgroundColor: "gray",
                          width: 10,
                          height: 10,
                          borderRadius: 5,
                          margin: 3,
                        }}
                      />
                    }
                  >
                    {dataStoryModal.stories.map((story: any, index: number) => {
                      return (
                        <View
                          key={index}
                          style={{
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <View
                            style={{
                              width: "100%",
                              height: "90%",
                              position: "relative",
                            }}
                          >
                            <View
                              style={{
                                position: "absolute",
                                top: 10,
                                left: 10,
                                zIndex: 3,
                              }}
                            >
                              <View style={global_styles.rowCenter}>
                                <Avatar
                                  user={dataStoryModal && dataStoryModal}
                                  size={{ width: 40, height: 40 }}
                                />
                                <View
                                  style={{
                                    marginLeft: 10,
                                  }}
                                >
                                  <Text
                                    style={{
                                      opacity: 0.6,
                                      fontSize: 15,
                                      color: fontColor,
                                    }}
                                  >
                                    {story.content}
                                  </Text>
                                  <Text
                                    style={{
                                      opacity: 0.6,
                                      fontSize: 12,
                                      color: fontColor,
                                    }}
                                  >
                                    {moment(story.createAt).fromNow()}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <Image
                              source={{ uri: story.urlImg }}
                              style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "cover",
                              }}
                            />
                          </View>
                        </View>
                      );
                    })}
                  </Swiper>
                </View>
              )}
            </View>
          </LinearGradientWrapper>
        </Modal>
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
                {items.map((item: any, index: number) => {
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
                    uri: auth.user && auth.user.avatar,
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
                    {auth.user && auth.user.name}
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
                    onPress={() => {
                      handleImageUpload((imageUri: string) => {
                        setImages((prevImages: string) => [
                          ...prevImages,
                          imageUri,
                        ]);
                      });
                    }}
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
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalStoryVisible}
        >
          {/* Modal story */}
          <LinearGradientWrapper>
            <View style={[global_styles.wrapper, { paddingTop: 0 }]}>
              {isLoading && <Loading></Loading>}
              <View style={global_styles.rowCenterBetween}>
                <View style={global_styles.rowCenter}>
                  <Ionicons
                    onPress={() => {
                      setModalStoryVisible(!isModalStoryVisible);
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
                    Story
                  </Text>
                </View>
                <TouchableOpacity onPress={handleAddStory}>
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
                    uri: auth.user && auth.user.avatar,
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
                    {auth.user && auth.user.fullName}
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
                  onChangeText={(text) => {
                    setStoryContent(text);
                  }}
                  style={styles.inputPost}
                  placeholder="Nhập nội dung..."
                  placeholderTextColor={greyColor}
                  selectionColor="white"
                />
                <View>
                  <Ionicons
                    onPress={() => {
                      handleImageUpload((imageUri: string) => {
                        setStoryImage(imageUri);
                      });
                    }}
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
                {storyImage && (
                  <Image
                    source={{
                      uri: storyImage,
                    }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 10,
                      marginRight: 10,
                      marginTop: 10,
                    }}
                  ></Image>
                )}
              </View>
            </View>
          </LinearGradientWrapper>
        </Modal>
        {/* Modal likes */}
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
        {/* Modal comment */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCommentModalVisible}
        >
          <CommentModal
            idPost={idPost && idPost}
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
