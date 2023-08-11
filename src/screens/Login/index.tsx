import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Image } from "@rneui/themed";
import { StackActions, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../redux/slice/authSlice";
import Loading from "../../Component/Loading";
import { btnBgr, btnColor, global_styles } from "../../../style";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
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
    color: "black",
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
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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
  const navigation = useNavigation();
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
  const [securePass, setSecurePass] = useState(false);
  const handleLogin = useCallback(() => {
    dispatch(login(data) as any);
  }, [data]);

  return (
    <LinearGradientWrapper>
      {isLoading == "loading" && <Loading />}
      <View style={[global_styles.rowCenter, { paddingTop: 50 }]}>
        <Image source={logo} style={{ width: 250, height: 200 }} />
      </View>

      <View style={styles.col_center}>
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

        {/* <Input
          onChangeText={(text) => {
            
          }}
          secureTextEntry={securePass}
          placeholder="Password"
          leftIcon={<Ionicons name="key" size={20} color="#3797EF" />}
          rightIcon={
            !securePass ? (
              <Ionicons
                onPress={(prev) => {
                  setSecurePass(true);
                }}
                name="eye-outline"
                size={20}
                color="#3797EF"
              />
            ) : (
              <Ionicons
                onPress={(prev) => {
                  setSecurePass(false);
                }}
                name="eye-off-outline"
                size={20}
                color="#3797EF"
              />
            )
          }
        /> */}
        <View style={[styles.login_btn_wrapper, { marginTop: 20 }]}>
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: btnBgr }}
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
          <Text style={styles.text}>Forgot Password</Text>
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
            Sign up
          </Text>
        </View>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
