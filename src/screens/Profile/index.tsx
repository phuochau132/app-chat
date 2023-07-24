import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { global_styles } from "../../../style";
import { Image } from "react-native-elements";

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
      <View style={global_styles.rowCenterBetween}>
        <View style={global_styles.rowCenter}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>PH_hau56</Text>
          <Ionicons name="chevron-down-outline" size={30} color="black" />
        </View>
        <View style={global_styles.rowCenterBetween}>
          <Ionicons
            style={{ marginRight: 10 }}
            name="add-circle-outline"
            size={30}
            color="black"
          />

          <Ionicons name="menu-outline" size={30} color="black" />
        </View>
      </View>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <View style={global_styles.ColumnCenter}>
          <Image
            source={{
              uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
            }}
            style={styles.img}
          />
          <Text style={{ fontWeight: "bold", marginTop: 5 }}>Phước hậu</Text>
        </View>
        <View style={[global_styles.ColumnCenter]}>
          <Text
            style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}
          >
            2
          </Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            Bài viết
          </Text>
        </View>
        <View style={[global_styles.ColumnCenter]}>
          <Text
            style={[
              styles.text,
              { fontWeight: "bold", textAlign: "center", fontSize: 16 },
            ]}
          >
            2
          </Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            Người theo giỏi
          </Text>
        </View>
        <View style={[global_styles.ColumnCenter]}>
          <Text
            style={{ fontWeight: "bold", textAlign: "center", fontSize: 16 }}
          >
            2
          </Text>
          <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
            Đang theo dõi
          </Text>
        </View>
      </View>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("editProfile");
          }}
          style={[global_styles.touchBtn]}
        >
          <Text
            style={{ width: 140, fontWeight: "bold" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Chỉnh sửa trang cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[global_styles.touchBtn]}>
          <Text
            style={{ width: 140, fontWeight: "bold" }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Chia sẻ trang cá nhân
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[global_styles.touchBtn]}>
          <Ionicons name="person-add" size={17} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;
