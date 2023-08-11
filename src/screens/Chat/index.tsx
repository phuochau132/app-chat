import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, seState, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import Constants from "expo-constants";

import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { stompClient } from "../../../index";
import { fontColor, global_styles, itemColor } from "../../../style";
import { sendMessage } from "../../redux/slice/userSlice";
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: "100%",
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: { fontColor },
  },
  inputToolbarContainer: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    borderTopColor: "#e8e8e8",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: itemColor,
    borderColor: "#e8e8e8",
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
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => {
    return state.auth;
  });

  const filterMessage = useCallback(() => {
    friendShip.room.message.forEach((item: any) => {
      if (auth.user.id != item.sender.id) {
        const message = {
          _id: item._id,
          text: item.text,
          createdAt: item.createAt,
          user: {
            _id: item.sender.id,
            name: item.sender.fullName,
            avatar: Constants.manifest.extra.HOST_SERVER + item.sender.avatar,
          },
        };
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, message)
        );
      } else {
        const message = {
          _id: item._id,
          text: item.text,
          createdAt: item.createAt,
          user: {
            _id: auth.user.id,
            name: auth.user.fullName,
            avatar: Constants.manifest.extra.HOST_SERVER + auth.user.avatar,
          },
        };
        setMessages((prevMessages) => [message, ...prevMessages]);
      }
    });
  }, []);
  useEffect(() => {
    filterMessage();
    stompClient.subscribe(
      `/topic/rooms/${friendShip.room.id}`,
      (message: any) => {
        console.log(98123);
        console.log(friendShip.room.id);
        const bodyData = JSON.parse(message.body);
        const formattedMessage: IMessage = {
          _id: bodyData.body._id,
          text: bodyData.body.text,
          createdAt: new Date(bodyData.body.createdAt),
          user: {
            _id: bodyData.body.user.id,
            name: bodyData.body.user.name,
            avatar: bodyData.body.user.avatar,
          },
        };

        if (bodyData.body.user._id != auth.user.id) {
          setMessages((prevMessages) => [formattedMessage, ...prevMessages]);
        }
      }
    );
  }, []);
  const handleSend = useCallback(
    (newMessages: IMessage[]) => {
      const formattedMessage: IMessage = {
        _id: newMessages[0]._id,
        text: newMessages[0].text,
        createdAt: newMessages[0].createdAt,
        user: {
          _id: auth.user.id,
          name: auth.user.fullName,
          avatar: Constants.manifest.extra.HOST_SERVER + auth.user.avatar,
        },
      };
      dispatch(
        sendMessage({
          data: {
            senderId: auth.user.id,
            receiverId: friendShip.user.id,
            roomId: friendShip.room.id,
            text: newMessages[0].text,
          },
          notificationData: {
            to: friendShip.user.expoPushToken,
            title: `Bạn có tin nhắn đến từ: ${auth.user.fullName}`,
            body: newMessages[0].text,
          },
        })
      );
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      stompClient.send(
        `/app/chat/${friendShip.room.id}`,
        {},
        JSON.stringify(formattedMessage)
      );
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
      const imageMessage: IMessage[] = [
        {
          _id: Math.round(Math.random() * 1000000),
          image: imageUri,
          createdAt: new Date(),
          user: {
            _id: auth.user.id,
            name: auth.user.name,
            avatar: Constants.manifest.extra.HOST_SERVER + auth.user.avatar,
          },
          text: "",
        },
      ];

      handleSend(imageMessage);
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

  const renderActions = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Ionicons
          name="image-outline"
          size={24}
          color={fontColor}
          onPress={handleImageUpload}
        />
      </View>
    );
  };

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={[global_styles.wrapper, { backgroundColor: "#5A544A" }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
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
          <Image
            source={{
              uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
            }}
            style={styles.img}
          />
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
      <View style={styles.items}>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(messages) => handleSend(messages)}
          user={{ ...auth.user, _id: auth.user.id }}
          listViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          renderComposer={(props) => (
            // Custom composer component
            <Composer {...props} placeholder="Message..." />
          )}
          renderSend={(props) => (
            <Send {...props}>
              <Ionicons name="send-outline" size={24} color={fontColor} />
            </Send>
          )}
          renderBubble={(props) => (
            <Bubble
              {...props}
              wrapperStyle={{
                right: { backgroundColor: "rgb(55, 151, 240)" },
              }}
            />
          )}
          renderInputToolbar={(props) => {
            const { containerStyle, ...otherProps } = props;
            return (
              <InputToolbar
                {...otherProps}
                containerStyle={[styles.inputToolbarContainer]}
                primaryStyle={global_styles.rowCenter}
                accessoryStyle={{}}
                renderSend={(sendProps) => {
                  const { containerStyle, ...otherSendProps } = sendProps;
                  return (
                    <Send
                      containerStyle={styles.sendContainer}
                      {...otherSendProps}
                    >
                      <View>
                        <Ionicons name="send" size={24} color={fontColor} />
                      </View>
                    </Send>
                  );
                }}
              />
            );
          }}
          textInputProps={{
            style: { color: "white", flex: 1, marginLeft: 10 },
          }}
          renderActions={renderActions}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
