import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Image } from "@rneui/themed";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import SockJS from "sockjs-client";
import { over } from "stompjs";

import {
  Bubble,
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    color: "black",
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
    color: "black",
  },
  inputToolbarContainer: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    borderTopColor: "#e8e8e8",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "#f9f8f8",
    borderColor: "#e8e8e8",
  },
  inputToolbarPrimary: {
    display: "flex",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sendContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
});
var stompClient: any = null;
export const Index: React.FC<{}> = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const auth = useSelector((state: any) => {
    return state.auth;
  });
  const [userData, setUserData] = useState({
    username: "",
    receivername: "",
    connected: false,
    message: "",
  });
  const connect = () => {
    let Sock = new SockJS(`${process.env.HOST_SERVER}/gs-guide-websocket`);
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };
  const onConnected = () => {
    stompClient.subscribe(`/topic/rooms`, (message: any) => {
      const bodyData = JSON.parse(message.body);
      const formattedMessage: IMessage = {
        _id: bodyData.body._id,
        text: bodyData.body.text,
        createdAt: new Date(bodyData.body.createdAt),
        user: {
          _id: bodyData.body.user.id,
          name: bodyData.body.user.name,
        },
      };
      if (bodyData.body.user._id != auth.user.id) {
        setMessages((prevMessages) => [formattedMessage, ...prevMessages]);
      }
    });
  };
  const onError = () => {
    console.log("err");
  };

  useEffect(() => {
    connect();
  }, []);
  const handleSend = useCallback(
    (newMessages: IMessage[]) => {
      const formattedMessage: IMessage = {
        _id: newMessages[0]._id,
        text: newMessages[0].text,
        createdAt: newMessages[0].createdAt,
        user: {
          _id: auth.user.id,
          name: auth.user.name,
        },
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );
      stompClient.send("/app/chat", {}, JSON.stringify(formattedMessage));
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
          color="black"
          onPress={handleImageUpload}
        />
      </View>
    );
  };

  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.row_center}>
        <Ionicons
          onPress={() => {
            navigation.goBack();
          }}
          name="arrow-back"
          size={20}
          color="black"
        />
        <View style={styles.info}>
          <Image
            source={{
              uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
            }}
            style={styles.img}
          />
          <Text style={styles.name}>Riven</Text>
        </View>
        <View style={styles.row_center}>
          <Ionicons
            style={{ marginRight: 15 }}
            name="call-outline"
            size={20}
            color="black"
          />
          <Ionicons name="videocam-outline" size={20} color="black" />
        </View>
      </View>
      <View style={styles.items}>
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          onSend={(messages) => handleSend(messages)}
          user={{
            _id: 1,
          }}
          listViewProps={{
            showsVerticalScrollIndicator: false,
          }}
          renderComposer={(props) => (
            // Custom composer component
            <Composer {...props} placeholder="Message..." />
          )}
          renderSend={(props) => (
            <Send {...props}>
              <Ionicons name="send-outline" size={24} color="black" />
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
                primaryStyle={styles.inputToolbarPrimary}
                accessoryStyle={{}}
                renderSend={(sendProps) => {
                  const { containerStyle, ...otherSendProps } = sendProps;
                  return (
                    <Send
                      containerStyle={styles.sendContainer}
                      {...otherSendProps}
                    >
                      <View>
                        <Ionicons name="send" size={24} color="black" />
                      </View>
                    </Send>
                  );
                }}
              />
            );
          }}
          renderActions={renderActions}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
