import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Image } from "@rneui/themed";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/slice/authSlice";
import Loading from "../../Component/Loading";
import { btnBgr, btnColor, fontColor, global_styles } from "../../../style";
import logo from "../../img/logo.png";

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
    marginLeft: 2,
  },
  float_right: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "white",
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
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const isLoading = useSelector((state: any) => state.auth.status);
  const user = useSelector((state: any) => state.auth.user);
  useEffect(() => {
    if (user) {
      navigation.dispatch(StackActions.replace("home"));
    }
  }, [user]);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleLogin = useCallback(() => {
    dispatch(login(data) as any);
  }, [data]);

  return (
    <View>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1502899576159-f224dc2349fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
        }}
        style={{ width: "100%", height: "100%", backgroundColor: "black" }}
      >
        {isLoading == "loading" && <Loading />}
        <View style={[global_styles.rowCenter, { paddingTop: 50 }]}>
          <Image source={logo} style={{ width: 250, height: 200 }} />
        </View>

        <View style={styles.col_center}>
          <View style={styles.inputContainer}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={20} color={"black"} />
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
              placeholder="UserName"
              placeholderTextColor="gray"
            />
          </View>
          <View style={[styles.inputContainer]}>
            <View style={styles.iconContainer}>
              <Ionicons name="key" size={20} color="black" />
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                setData((prev) => ({
                  ...prev,
                  password: text,
                }));
              }}
              value={data.password}
              placeholder="Password"
              placeholderTextColor="gray"
            />
          </View>
          <View style={[styles.login_btn_wrapper, { marginTop: 20 }]}>
            <TouchableOpacity
              style={{ padding: 10, backgroundColor: btnBgr, borderRadius: 10 }}
              onPress={handleLogin}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                  color: btnColor,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.float_right, { marginTop: 20 }]}>
            <Text
              style={styles.text}
              onPress={() => {
                navigation.navigate("forgotPassword");
              }}
            >
              Forgot Password
            </Text>
          </View>
          <View style={styles.row_center}>
            <Text style={{ color: fontColor, opacity: 0.6 }}>
              Don't have an account?
            </Text>
            <Text
              onPress={() => {
                navigation.navigate("register");
              }}
              style={styles.text}
            >
              Sign up
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Index;
