import { Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { blueColor, fontColor, global_styles, greyColor } from "../../../style";
import { Image, Input, Overlay } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { changeInfo } from "../../redux/slice/authSlice";
import Constants from "expo-constants";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
import { uploadFiles } from "../../util/cloudary";

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  text: {
    width: 60,
    textAlign: "center",
  },
  inputTitle: {
    fontSize: 12,
    marginLeft: 10,
    opacity: 0.7,
    color: fontColor,
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<any>();
  const auth = useSelector((state: any) => state.auth);
  const [inputValue, setInputValue] = useState("");
  const [modalInputValue, setModalInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [data, setData] = useState({
    id: Number(auth.user.id),
    fullName: auth.user.fullName,
    birthDay: auth.user.birthDay,
    nickName: auth.user.nickName,
    story: auth.user.story,
    avatar: auth.user.avatar,
  });
  const [modal, setModal] = useState({
    name: "",
    specificName: "",
    type: 0,
  });

  const toggleOverlay = () => {
    if (modal.type == 0) {
      setData((prev) => {
        return { ...prev, fullName: inputValue };
      });
    }
    if (modal.type == 1) {
      setData((prev) => {
        return { ...prev, nickName: inputValue };
      });
    }
    if (modal.type == 2) {
      setData((prev) => {
        return { ...prev, birthDay: inputValue };
      });
    }
    if (modal.type == 3) {
      setData((prev) => {
        return { ...prev, story: inputValue };
      });
    }
    setVisible(!visible);
  };

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
      const imageUri: any = result.assets[0].uri;
      setImageUri(imageUri);
    }
  };
  const handleChangeProfile = async () => {
    try {
      let reqData: any = {
        user: data,
      };

      if (imageUri) {
        const fileUploaded: any = await uploadFiles({
          fileUris: [imageUri],
        });

        if (fileUploaded) {
          reqData = {
            user: {
              ...data,
              avatar: fileUploaded[0],
            },
          };
        }
      }
      dispatch(changeInfo(reqData));
    } catch (error) {}
  };
  return (
    <LinearGradientWrapper>
      <View style={global_styles.wrapper}>
        <View style={global_styles.rowCenterBetween}>
          <Ionicons
            onPress={() => {
              navigation.goBack();
            }}
            name="close-outline"
            size={30}
            color={fontColor}
          />
          <Text style={{ fontSize: 18, fontWeight: "bold", color: fontColor }}>
            Chỉnh sửa trang cá nhân
          </Text>
          <TouchableOpacity>
            <Ionicons
              onPress={handleChangeProfile}
              style={{ color: blueColor }}
              name="checkmark-outline"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <View style={[global_styles.rowCenter, { marginTop: 20 }]}>
          <View style={[global_styles.ColumnCenter, { width: "100%" }]}>
            <View style={[global_styles.rowCenter, { width: "100%" }]}>
              <Image
                source={{
                  uri: auth.user.avatar,
                }}
                style={[styles.img, { marginRight: 5 }]}
              />
              {imageUri && (
                <Ionicons
                  name="chevron-forward-outline"
                  size={30}
                  color={fontColor}
                />
              )}
              {imageUri && (
                <Image
                  source={{
                    uri: imageUri,
                  }}
                  style={[styles.img, { marginLeft: 5 }]}
                />
              )}
            </View>
            <TouchableOpacity onPress={handleImageUpload}>
              <Text
                style={{ marginTop: 10, fontWeight: "bold", color: blueColor }}
              >
                Chỉnh sửa ảnh
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[global_styles.ColumnCenter, { marginTop: 20, width: "100%" }]}
        >
          <View
            style={[
              global_styles.ColumnCenter,
              { alignItems: "flex-start", width: "100%" },
            ]}
          >
            <Text style={styles.inputTitle}>Tên</Text>
            <Input
              onPressIn={() => {
                setModal({
                  name: "Tên",
                  specificName: "Tên người dùng",
                  type: 0,
                });
                setModalInputValue(data.fullName);
                setVisible(!visible);
              }}
              value={data.fullName}
              style={{ fontSize: 15, color: fontColor }}
              placeholder="Tên người dùng"
            />
          </View>
          <View
            style={[
              global_styles.ColumnCenter,
              { alignItems: "flex-start", width: "100%" },
            ]}
          >
            <Text style={styles.inputTitle}>Biệt danh</Text>
            <Input
              onPressIn={() => {
                setModal({
                  name: "Biệt danh",
                  specificName: "Biệt danh",
                  type: 1,
                });
                setModalInputValue(data.nickName);
                setVisible(!visible);
              }}
              value={data.nickName}
              style={{ fontSize: 15, color: fontColor }}
              placeholder="Biệt danh"
            />
          </View>
          <View
            style={[
              global_styles.ColumnCenter,
              { alignItems: "flex-start", width: "100%" },
            ]}
          >
            <Text style={styles.inputTitle}>Ngày sinh</Text>
            <Input
              onPressIn={() => {
                setModal({
                  name: "Ngày sinh",
                  specificName: "Ngày sinh",
                  type: 2,
                });
                setModalInputValue(data.birthDay);
                setVisible(!visible);
              }}
              value={data.birthDay}
              style={{ fontSize: 15, color: fontColor }}
              placeholder="Ngày sinh"
            />
          </View>
          <View
            style={[
              global_styles.ColumnCenter,
              { alignItems: "flex-start", width: "100%" },
            ]}
          >
            <Text style={styles.inputTitle}>Tiểu sử</Text>
            <Input
              onPressIn={() => {
                setModal({
                  name: "Tiểu sử",
                  specificName: "Tiểu sử",
                  type: 3,
                });
                setModalInputValue(data.story);
                setVisible(!visible);
              }}
              value={data.story}
              style={{ fontSize: 15, color: fontColor }}
              placeholder="Tiểu sử"
            />
          </View>
        </View>
        <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
          <View style={{ width: 200 }}>
            <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}>
              {modal.name}
            </Text>
            <View>
              <Input
                onChangeText={(text) => {
                  setInputValue(text);
                }}
                defaultValue={modalInputValue}
                placeholder={modal.specificName}
                style={{ fontSize: 15 }}
              ></Input>
            </View>
            <Button title="Oke" onPress={toggleOverlay} />
          </View>
        </Overlay>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
