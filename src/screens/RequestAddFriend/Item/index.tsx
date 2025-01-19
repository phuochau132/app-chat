import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "@rneui/themed";
import { useDispatch } from "react-redux";
import Constants from "expo-constants";

import { blueColor, global_styles, greyColorBtn } from "../../../../style";
import { acceptRequestAF, delRequestAF } from "../../../redux/slice/userSlice";

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },
  btn: {
    width: "48%",
    textAlign: "center",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});
const Item: React.FC<{ item: any }> = ({ item }) => {
  const dispatch = useDispatch();
  const user = item.user;
  const handleRequest = (action: number) => {
    if (!action) {
      dispatch(
        acceptRequestAF({
          friend: item,
        })
      );
    } else {
      dispatch(delRequestAF(item.id));
    }
  };
  const currentDate = new Date();
  const day = currentDate.getDate();
  const countDay = Number(item.createAt.split("-")[2].split("T")[0]) - day;
  let showDayAgo;
  if (countDay == 0) {
    showDayAgo = "Hôm nay";
  } else {
    if (countDay == 1) {
      showDayAgo = "Hôm qua";
    } else {
      showDayAgo = day + " ngày";
    }
  }

  return (
    <View
      // onPress={() => {
      //   navigation.navigate("chat");
      // }}
      style={styles.container}
    >
      <View>
        <Image
          source={{
            uri: user.avatar,
          }}
          style={styles.img}
        >
          {/* <View style={styles.span}></View> */}
        </Image>
      </View>
      <View style={[global_styles.ColumnCenter, { flex: 1, padding: 10 }]}>
        <View style={[global_styles.rowCenterBetween, { width: "100%" }]}>
          <Text
            style={[global_styles.text, { fontSize: 18, fontWeight: "bold" }]}
          >
            {user.fullName}
          </Text>
          <Text style={[global_styles.text, { fontSize: 14, opacity: 0.6 }]}>
            {showDayAgo}
          </Text>
        </View>
        <View
          style={[
            global_styles.rowCenterBetween,
            { width: "100%", marginTop: 5 },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              handleRequest(0);
            }}
            style={[styles.btn, { backgroundColor: blueColor }]}
          >
            <Text style={[global_styles.text, styles.text, { color: "white" }]}>
              Chấp Nhận
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleRequest(1);
            }}
            style={[styles.btn, { backgroundColor: greyColorBtn }]}
          >
            <Text style={[global_styles.text, styles.text]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Item;
