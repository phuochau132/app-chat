import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Header } from "@rneui/themed";
import { CheckCircleFilled } from "@ant-design/icons";
import { Image } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import { global_styles } from "../../../style";

const styles = StyleSheet.create({
  item: {
    width: 100,
    display: "flex",
    textAlign: "center",
  },
  story: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#333",
    overflow: "hidden",
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  return (
    <View style={global_styles.wrapper}>
      {/* {loading && (
        <View style={global_styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )} */}
      <Header
        placement="left"
        leftComponent={<Ionicons name="home" size={20} color="white" />}
        centerComponent={{ text: "Appchat", color: "black" }}
        rightComponent={
          <Ionicons
            onPress={() => {
              setLoading(true);
              navigation.navigate("chatListFriend");
            }}
            name="chatbox-outline"
            size={20}
            color="white"
          />
        }
      />
      <View style={styles.story}>
        <Avatar
          size={80}
          rounded
          source={{
            uri: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s200x200&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX80726A&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfDoE5paAm5cFlKDMu8uIl-40GYnNUnh6f3jXNnqyxwsqA&oe=64D5B0CD",
          }}
          icon={{ name: "rowing" }}
        />
        <Avatar
          size={80}
          rounded
          source={{
            uri: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s200x200&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX80726A&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfDoE5paAm5cFlKDMu8uIl-40GYnNUnh6f3jXNnqyxwsqA&oe=64D5B0CD",
          }}
          icon={{ name: "rowing" }}
        />
        <Avatar
          size={80}
          rounded
          source={{
            uri: "https://scontent.fsgn8-4.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s200x200&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX80726A&_nc_ht=scontent.fsgn8-4.fna&oh=00_AfDoE5paAm5cFlKDMu8uIl-40GYnNUnh6f3jXNnqyxwsqA&oe=64D5B0CD",
          }}
          icon={{ name: "rowing" }}
        />
      </View>
    </View>
  );
};

export default Index;
