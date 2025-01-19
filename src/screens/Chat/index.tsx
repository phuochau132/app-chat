import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { IMessage } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import { stompClient } from "../../../index";
import { fontColor, global_styles, itemColor } from "../../../style";
import { addMessage, sendMessage } from "../../redux/slice/userSlice";
import Avatar from "../../Component/Avatar";
import { TextInput } from "react-native-paper";
import Bubble from "./Bubble";
import { Image } from "react-native-elements";
import { uploadFiles } from "../../util/cloudary";
import Loading from "../../Component/Loading";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    color: { fontColor },
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
  row_center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    backgroundColor: "#F2F2F2",
  },
  items: {
    marginTop: 20,
    width: "100%",
    flex: 1,
  },
  info: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  name: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: fontColor,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    marginLeft: 8,
    borderBottomWidth: 0,
    borderWidth: 0, // Không border
  },
  sendButton: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: { fontColor },
  },
  inputToolbarContainer: {
    width: "100%",
    borderRadius: 20,
  },

  sendContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
});
export const Index: React.FC<{}> = () => {
  const route = useRoute();
  const { item } = route.params;
  const friendShip = JSON.parse(item);
  const dispatch = useDispatch<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState("");
  const auth = useSelector((state: any) => {
    return state.auth;
  });

  const filterMessage = useCallback(() => {
    const array: any = [];
    const messageList = friendShip.room.message.slice(-10);

    messageList.forEach((item: any) => {
      if (auth.user.id != item.sender.id) {
        const message = {
          _id: item._id,
          text: item.text,
          image:
            item.imgMessage &&
            item.imgMessage.map((item) => {
              return item.urlImg;
            }),
          createdAt: item.createAt,
          user: {
            _id: item.sender.id,
            name: item.sender.fullName,
            avatar: item.sender.avatar,
          },
        };
        array.push(message);
      } else {
        const message = {
          _id: item._id,
          text: item.text,
          image:
            item.imgMessage &&
            item.imgMessage.map((item) => {
              return item.urlImg;
            }),
          createdAt: item.createAt,
          user: {
            _id: auth.user.id,
            name: auth.user.fullName,
            avatar: auth.user.avatar,
          },
        };
        array.push(message);
      }
    });
    setMessages(array);
  }, []);
  useEffect(() => {
    filterMessage();
    const subscription = stompClient.subscribe(
      `/topic/rooms/${friendShip.room.id}`,
      (message: any) => {
        const bodyData = JSON.parse(message.body);
        const formattedMessage: IMessage = {
          _id: bodyData.body._id,
          text: bodyData.body.text,
          image: bodyData.body.image,
          createdAt: new Date(bodyData.body.createdAt),
          user: {
            _id: bodyData.body.user._id,
            name: bodyData.body.user.name,
            avatar: bodyData.body.user.avatar,
          },
        };
        if (bodyData.body.user._id != auth.user.id) {
          dispatch(
            addMessage({
              roomId: friendShip.room.id,
              message: {
                _id: bodyData.body._id,
                sender: {
                  id: bodyData.body.user.id,
                  avatar: bodyData.body.user.avatar,
                },
                receiver: { id: auth.user.id },
                roomId: friendShip.room.id,
                text: bodyData.body.text,
                createAt: bodyData.body.createdAt,
              },
            })
          );
          setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        } else {
          dispatch(
            addMessage({
              roomId: friendShip.room.id,
              message: {
                _id: bodyData.body._id,
                sender: {
                  id: auth.user.id,
                  avatar: auth.user.avatar,
                },
                receiver: {
                  id: bodyData.body.user.id,
                  avatar: bodyData.body.user.avatar,
                },
                roomId: friendShip.room.id,
                text: bodyData.body.text,
                createAt: bodyData.body.createdAt,
              },
            })
          );
        }
      }
    );
  }, []);
  const [status, setStatus] = useState(false);
  const handleSend = useCallback(
    async (newMessages: any) => {
      setStatus(true);
      let imagesList = null;

      try {
        if (newMessages[0].text.trim() || images.length > 0) {
          if (newMessages[0].images.length > 0) {
            try {
              const fileUploaded = await uploadFiles({
                fileUris: newMessages[0].images,
              });
              imagesList = fileUploaded;
            } catch (error) {
              console.error("Error uploading files:", error);
            }
          }

          const formattedMessage: IMessage = {
            _id: newMessages[0]._id,
            text: newMessages[0].text,
            image: imagesList ? [imagesList[0]] : [],
            createdAt: newMessages[0].createdAt,
            user: {
              _id: auth.user.id,
              name: auth.user.fullName,
              avatar: auth.user.avatar,
            },
          };

          await dispatch(
            sendMessage({
              data: {
                senderId: auth.user.id,
                receiverId: friendShip.user.id,
                roomId: friendShip.room.id,
                text: newMessages[0].text,
                images: imagesList,
              },
              notificationData: {
                to: friendShip.user.expoPushToken,
                title: `Bạn có tin nhắn đến từ: ${auth.user.name}`,
                body: newMessages[0].text,
              },
            })
          );

          setMessages((prev) => [...prev, formattedMessage]);
          setInputValue("");
          stompClient.send(
            `/app/chat/${friendShip.room.id}`,
            {},
            JSON.stringify(formattedMessage)
          );
        }
      } catch (error) {
        console.error("Error handling send:", error);
      } finally {
        setStatus(false);
      }
    },
    [messages, auth, friendShip, dispatch]
  );
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
      setImages((prev: string[]) => {
        return [...prev, imageUri];
      });
    }
  };

  // const handleVideoUpload = async () => {
  //   const result = await DocumentPicker.getDocumentAsync({
  //     type: "video/*",
  //   });
  //   if (result.type === "success") {
  //     const { uri } = result;
  //     setVideoUri(uri);
  //     const videoMessage: IMessage = {
  //       _id: Math.round(Math.random() * 1000000),
  //       video: uri,
  //       createdAt: new Date(),
  //       user: {
  //         _id: 1,
  //         name: "hau",
  //       },
  //       text: "",
  //     };

  //     handleSend([videoMessage]);
  //   }
  // };
  // const handleScroll = (event: any) => {
  //   const step=0
  //   const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  //   if (contentOffset.y <= 0) {
  //     setMessages(me)
  //   }
  // };
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View
      style={[
        global_styles.wrapper,
        global_styles.ColumnCenter,
        { backgroundColor: "#5A544A", paddingTop: 50 },
      ]}
    >
      {status && <Loading />}
      <View style={global_styles.rowCenter}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="arrow-back"
          size={20}
          color={fontColor}
        />
        <View style={styles.info}>
          <Avatar user={friendShip.user} size={{ width: 50, height: 50 }} />
          <Text style={styles.name}>{auth.user.fullName}</Text>
        </View>
        <View style={styles.row_center}></View>
      </View>
      <KeyboardAvoidingView
        style={[global_styles.wrapper, { flex: 1 }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <View
          style={[
            global_styles.ColumnCenter,
            styles.items,
            { justifyContent: "space-around" },
          ]}
        >
          <ScrollView
            // onScroll={handleScroll}
            ref={scrollViewRef}
            style={{ flex: 1, position: "relative", width: "100%" }}
            showsVerticalScrollIndicator={false}
          >
            {/* Render your chat bubbles here */}
            {messages.map((item, index) => {
              return (
                <Bubble
                  key={index}
                  isToMe={!(item.user._id == auth.user.id)}
                  data={item}
                />
              );
            })}
          </ScrollView>

          {/* Input component */}
          <View
            style={[
              global_styles.rowCenter,
              {
                backgroundColor: itemColor,
                borderRadius: 50,
                height: 50,
                padding: 10,
              },
            ]}
          >
            <TouchableOpacity onPress={handleImageUpload}>
              <Ionicons
                name="images"
                size={20}
                color={fontColor}
                style={{ marginLeft: 1, opacity: 0.6 }}
              />
            </TouchableOpacity>
            <TextInput
              selectionColor="hsl(210,8%,75%)"
              style={styles.input}
              placeholderTextColor={"hsl(210,8%,75%)"}
              textColor={fontColor}
              placeholder="Type your message..."
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              underlineColorAndroid="red"
              keyboardAppearance="light"
              theme={{
                colors: {
                  primary: "transparent",
                },
              }}
            />
            {inputValue && (
              <TouchableOpacity
                onPress={() => {
                  handleSend([
                    {
                      _id: Math.floor(Math.random() * 100),
                      text: inputValue,
                      images: images,
                      createdAt: new Date(),
                    },
                  ]);
                }}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color="#0084ff"
                  style={{ marginLeft: 1, opacity: 0.6 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={[
            global_styles.rowCenter,
            { marginTop: 10, backgroundColor: itemColor, position: "relative" },
          ]}
        >
          {images.length > 0 &&
            images.map((item: string, index) => {
              return (
                <Image
                  key={index}
                  source={{
                    uri: item,
                  }}
                  style={{
                    borderRadius: 20,
                    width: 50,
                    height: 50,
                    marginRight: 10,
                  }}
                ></Image>
              );
            })}
          {images.length > 0 && (
            <TouchableOpacity
              style={{ position: "absolute", top: 0, right: 0 }}
              onPress={() => {
                setImages([]);
              }}
            >
              <Ionicons
                name="close-circle-outline"
                size={20}
                color={fontColor}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Index;
