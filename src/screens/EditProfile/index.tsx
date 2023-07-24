import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { blueColor, global_styles, greyColor } from "../../../style";
import { Icon, Image, Input, Overlay } from "react-native-elements";
import { TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  img: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 5,
  },
  text: {
    width: 60,
    textAlign: "center",
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const [inputValue, setInputValue] = useState("");
  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  const [imageUri, setImageUri] = useState(null);

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
      console.log(imageUri);
      setImageUri(imageUri);
    }
  };
  return (
    <View style={global_styles.wrapper}>
      <View style={global_styles.rowCenterBetween}>
        <Ionicons name="close-outline" size={30} color="black" />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Chỉnh sửa trang cá nhân
        </Text>
        <Ionicons
          style={{ color: blueColor }}
          name="checkmark-outline"
          size={30}
          color="black"
        />
      </View>
      <View style={[global_styles.rowCenter, { marginTop: 20 }]}>
        <View style={global_styles.ColumnCenter}>
          <View style={global_styles.rowCenterBetween}>
            <Image
              source={{
                uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
              }}
              style={styles.img}
            />
            {imageUri && (
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.img}
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
          <Text style={{ fontSize: 12, marginLeft: 10, opacity: 0.7 }}>
            Tên
          </Text>
          <Input style={{ fontSize: 15 }} placeholder="Tên người dùng" />
        </View>
        <View
          style={[
            global_styles.ColumnCenter,
            { alignItems: "flex-start", width: "100%" },
          ]}
        >
          <Text style={{ fontSize: 12, marginLeft: 10, opacity: 0.7 }}>
            Danh xưng
          </Text>
          <Input
            onFocus={toggleOverlay}
            style={{ fontSize: 15 }}
            placeholder="Danh xưng"
          />
        </View>
        <View
          style={[
            global_styles.ColumnCenter,
            { alignItems: "flex-start", width: "100%" },
          ]}
        >
          <Text style={{ fontSize: 12, marginLeft: 10, opacity: 0.7 }}>
            Ngày sinh
          </Text>
          <Input style={{ fontSize: 15 }} placeholder="Ngày sinh" />
        </View>
        <View
          style={[
            global_styles.ColumnCenter,
            { alignItems: "flex-start", width: "100%" },
          ]}
        >
          <Text style={{ fontSize: 12, marginLeft: 10, opacity: 0.7 }}>
            Tiểu sử
          </Text>
          <Input style={{ fontSize: 15 }} placeholder="Tiểu sử" />
        </View>
      </View>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
        <View style={{ width: 200 }}>
          <Text style={{ marginLeft: 10, fontSize: 18, fontWeight: "bold" }}>
            Name
          </Text>
          <View>
            <Input style={{ fontSize: 15 }}>
              Welcome to React Native Elements
            </Input>
          </View>
          <Button title="Oke" onPress={toggleOverlay} />
        </View>
      </Overlay>
    </View>
  );
};

export default Index;
