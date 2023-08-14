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
let check = false;
export const Index: React.FC<{}> = () => {
  const route = useRoute();
  const { item } = route.params;
  const friendShip = JSON.parse(item);
  const dispatch = useDispatch();
  const scrollViewRef = useRef(null);
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
    friendShip.room.message.forEach((item: any) => {
      if (auth.user.id != item.sender.id) {
        const message = {
          _id: item._id,
          text: item.text,
          image: [],
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
          image: [],
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
    if (!check) {
      stompClient.subscribe(
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
    }
    check = true;
  }, []);
  console.log("haudeptrai");
  console.log(messages);

  const handleSend = useCallback(
    (newMessages: any) => {
      if (newMessages[0].text.trim() || images.length > 0) {
        const formattedMessage: IMessage = {
          _id: newMessages[0]._id,
          text: newMessages[0].text,
          image: newMessages[0].images,
          createdAt: newMessages[0].createdAt,
          user: {
            _id: auth.user.id,
            name: auth.user.fullName,
            avatar: auth.user.avatar,
          },
        };
        dispatch(
          sendMessage({
            data: {
              senderId: auth.user.id,
              receiverId: friendShip.user.id,
              roomId: friendShip.room.id,
              text: newMessages[0].text,
              images: newMessages[0].images,
            },
            notificationData: {
              to: friendShip.user.expoPushToken,
              title: `Bạn có tin nhắn đến từ: ${auth.user.fullName}`,
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
    },

    [messages]
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

  const handleVideoUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
    });
    if (result.type === "success") {
      const { uri } = result;
      setVideoUri(uri);
      const videoMessage: IMessage = {
        _id: Math.round(Math.random() * 1000000),
        video: uri,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: "hau",
        },
        text: "",
      };

      handleSend([videoMessage]);
    }
  };
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
        { backgroundColor: "#5A544A" },
      ]}
    >
      <View style={global_styles.rowCenter}>
        <Ionicons
          onPress={() => {
            // navigation.goBack();
          }}
          name="arrow-back"
          size={20}
          color={fontColor}
        />
        <View style={styles.info}>
          <Avatar user={friendShip.user} size={{ width: 50, height: 50 }} />
          <Text style={styles.name}>{auth.user.nickName}</Text>
        </View>
        <View style={styles.row_center}>
          <Ionicons
            style={{ marginRight: 15 }}
            name="call-outline"
            size={20}
            color={fontColor}
          />
          <Ionicons name="videocam-outline" size={20} color={fontColor} />
        </View>
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
              underlineColorAndroid="transparent"
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
                  color={fontColor}
                  style={{ marginLeft: 1, opacity: 0.6 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View
          style={[
            global_styles.rowCenter,
            { marginTop: 10, backgroundColor: itemColor },
          ]}
        >
          {images.map((item: string, index) => {
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
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Index;
