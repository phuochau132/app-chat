import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Image } from "@rneui/themed";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  col_center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  row_center: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
  },
  item: {
    aspectRatio: 1,
    width: 50,
    height: 50,
    flex: 1,
  },
  login_btn_wrapper: {
    width: "100%",
    paddingHorizontal: 10,
  },
  text: {
    color: "#3797EF",
    fontWeight: "bold",
  },
  float_right: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <Image
        source={{
          uri: "https://media0.giphy.com/media/BHNfhgU63qrks/giphy.gif?cid=ecf05e476tqqs0mfvcdqrspikz6sfigfo0h9p02ft1z1pu8y&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        }}
        style={{ width: "100%", height: 200 }}
      />
      <View style={styles.col_center}>
        <Input
          placeholder="UserName"
          leftIcon={<Ionicons name="person-circle" size={20} color="#3797EF" />}
        />
        <Input
          placeholder="Password"
          leftIcon={<Ionicons name="key" size={20} color="#3797EF" />}
        />
        <View style={styles.login_btn_wrapper}>
          <Button
            onPress={() => {
              navigation.navigate("chatListFriend");
            }}
            title="Login"
          />
        </View>
        <View style={[styles.float_right, { marginTop: 20 }]}>
          <Text style={styles.text}>Forgot Password</Text>
        </View>
      </View>
      <View style={styles.row_center}>
        <Text style={{ color: "#000000", opacity: 0.6 }}>
          Don't have an account?
        </Text>
        <Text
          onPress={() => {
            navigation.navigate("register");
          }}
          style={styles.text}
        >
          {" "}
          Sign up
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
