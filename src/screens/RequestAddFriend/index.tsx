import { StyleSheet, Text, View, ScrollView } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { blueColor, global_styles } from "../../../style";
import Item from "./Item";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    paddingLeft: 20,
    paddingRight: 20,
    color: "black",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
  },
  row_center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    backgroundColor: "#F2F2F2",
  },
  items: {
    marginTop: 20,
    width: "100%",
    flex: 1,
  },
  info: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-start",
    marginLeft: 10,
  },
  name: {
    marginLeft: 10,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: "100%",
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    color: "black",
  },
  inputToolbarContainer: {
    borderWidth: 2,
    paddingHorizontal: 10,
    paddingVertical: 5,
    height: 50,
    borderTopColor: "#e8e8e8",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    backgroundColor: "#f9f8f8",
    borderColor: "#e8e8e8",
  },
  inputToolbarPrimary: {
    display: "flex",
    alignItems: "center",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sendContainer: {
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export const Index: React.FC<{}> = () => {
  const listRequestAddFriend = useSelector(
    (state: any) => state.user.listRequestAddFriend
  );
  return (
    <LinearGradientWrapper>
      <View style={global_styles.wrapper}>
        <Text style={[global_styles.text]}>Bạn bè</Text>
        <View style={[global_styles.rowCenterBetween, { marginTop: 15 }]}>
          <View style={global_styles.rowCenter}>
            <Text
              style={[global_styles.text, { fontSize: 18, fontWeight: "bold" }]}
            >
              Lời mời kết bạn
            </Text>
            <Text
              style={[
                global_styles.text,
                { marginLeft: 5, fontSize: 18, fontWeight: "bold" },
              ]}
            >
              {listRequestAddFriend.length}
            </Text>
          </View>
          <Text
            style={[global_styles.text, { fontSize: 16, color: blueColor }]}
          >
            Xem tất cả
          </Text>
        </View>
        <View style={styles.items}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {listRequestAddFriend.map((item: any, index: number) => {
              return <Item key={index} item={item} />;
            })}
          </ScrollView>
        </View>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
