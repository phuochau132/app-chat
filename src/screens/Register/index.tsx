import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../redux/slice/registerSlice";
import { TextInput } from "react-native";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
import { btnBgr, btnColor, fontColor, global_styles } from "../../../style";
import Loading from "../../Component/Loading";
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
        <View style={[styles.inputContainer]}>
          <View style={styles.iconContainer}>
            <Ionicons name="key" size={20} color="black" />
          </View>
          <TextInput
            style={styles.input}
            onChangeText={(text) => {
              setData((prev) => ({
                ...prev,
                rpPassword: text,
              }));
            }}
            value={data.rpPassword}
            placeholder="Repeat Password"
            placeholderTextColor="gray"
          />
        </View>
        <View style={[styles.login_btn_wrapper, { marginTop: 20 }]}>
          <TouchableOpacity
            style={{ padding: 10, backgroundColor: btnBgr }}
            onPress={handleRegister}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
                color: btnColor,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row_center}>
          <Ionicons name="arrow-back" size={20} color={fontColor} />
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
    </LinearGradientWrapper>
  );
};

export default Index;
