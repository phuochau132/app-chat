import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Image } from "@rneui/themed";
import { Icon, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  center: {
    display: "flex",
    alignItems: "center",
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
    color: "#1877F2",
    fontWeight: "bold",
  },
  row_center: {
    marginTop: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
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
      <View style={styles.center}>
        <Input
          placeholder="UserName"
          leftIcon={<Ionicons name="person-circle" size={20} color="#1877F2" />}
        />
        <Input
          placeholder="Password"
          leftIcon={<Ionicons name="key" size={20} color="#1877F2" />}
        />
        <Input
          placeholder="Repeat Password"
          leftIcon={<Ionicons name="key" size={20} color="#1877F2" />}
        />
        <View style={styles.login_btn_wrapper}>
          <Button
            onPress={() => {
              navigation.navigate("home");
            }}
            title="Register"
          />
        </View>
        <View style={styles.row_center}>
          <Ionicons name="arrow-back" size={20} color="#1877F2" />
          <Text
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.text}
          >
            Login
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Index;
