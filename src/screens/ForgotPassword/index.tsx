import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TextInput } from "react-native";
import { btnBgr, btnColor, fontColor, global_styles } from "../../../style";
import Loading from "../../Component/Loading";
import logo from "../../img/logo.png";
import Toast from "react-native-simple-toast";
import { forgotPassword } from "../../redux/slice/authSlice";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  nameBrand: {
    fontSize: 50,
    fontWeight: "bold",
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
    color: fontColor,
    fontWeight: "bold",
  },
  float_right: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: fontColor,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(128, 128, 128, 0.4)",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "white",
  },
  iconContainer: {
    borderRightWidth: 1,
    borderColor: "black",
    paddingRight: 10,
    marginRight: 10,
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => state.auth.status);
  const [data, setData] = useState({
    email: "",
  });
  const handleForgotPassword = useCallback(async () => {
    try {
      const isAllFieldsFilled = Object.values(data).every(
        (field) => field.trim() !== ""
      );
      // await sendDirectSMS("+84979574301", "etasdasdasd");
      if (isAllFieldsFilled) {
        await dispatch(forgotPassword(data) as any);
      } else {
        Toast.show("Vui lòng nhập đầy đủ thông tin!", Toast.LONG, {
          backgroundColor: "white",
          textColor: "black",
        });
      }
    } catch (error) {}
  }, [data]);

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {isLoading == "loading" && <Loading />}
      <View style={[global_styles.rowCenter, { paddingTop: 50 }]}>
        <Image source={logo} style={{ width: 250, height: 200 }} />
      </View>
      <View style={[styles.col_center]}>
        <View style={styles.inputContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="person-circle" size={20} color="black" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setData((prev) => ({
                ...prev,
                email: text,
              }));
            }}
            value={data.email}
            placeholder="Email"
            placeholderTextColor="gray"
          />
        </View>
        <View style={[styles.login_btn_wrapper, { marginTop: 20 }]}>
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: btnBgr }}
            onPress={handleForgotPassword}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: btnColor,
              }}
            >
              Submit
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="arrow-back-circle-outline"
            size={40}
            color={fontColor}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Index;
