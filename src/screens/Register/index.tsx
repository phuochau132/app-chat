import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Image } from "@rneui/themed";
import { Icon, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slice/registerSlice";
import { ActivityIndicator } from "react-native-paper";

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
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }],
    zIndex: 1,
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.register.status);
  const [data, setData] = useState({
    email: "",
    password: "",
    rpPassword: "",
  });
  const handleRegister = useCallback(() => {
    dispatch(register(data) as any);
  }, [data]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      {isLoading == "loading" && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      )}
      <Image
        source={{
          uri: "https://media0.giphy.com/media/BHNfhgU63qrks/giphy.gif?cid=ecf05e476tqqs0mfvcdqrspikz6sfigfo0h9p02ft1z1pu8y&ep=v1_gifs_search&rid=giphy.gif&ct=g",
        }}
        style={{ width: "100%", height: 200 }}
      />
      <View style={styles.center}>
        <Input
          onChangeText={(text) => {
            setData((prev) => ({
              ...prev,
              email: text,
            }));
          }}
          placeholder="UserName"
          leftIcon={<Ionicons name="person-circle" size={20} color="#1877F2" />}
        />
        <Input
          onChangeText={(text) => {
            setData((prev) => ({
              ...prev,
              password: text,
            }));
          }}
          placeholder="Password"
          leftIcon={<Ionicons name="key" size={20} color="#1877F2" />}
        />
        <Input
          onChangeText={(text) => {
            setData((prev) => ({
              ...prev,
              rpPassWord: text,
            }));
          }}
          placeholder="Repeat Password"
          leftIcon={<Ionicons name="key" size={20} color="#1877F2" />}
        />
        <View style={styles.login_btn_wrapper}>
          <Button
            onPress={() => {
              handleRegister();
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
