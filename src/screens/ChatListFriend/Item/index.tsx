import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {},
  content_message: {
    opacity: 0.6,

    overflow: "hidden",
  },
  status: {
    opacity: 0.6,
    marginLeft: 15,
  },
  span: {
    width: 10,
    height: 10,
    backgroundColor: "green",
    borderRadius: 100,
    position: "absolute",
    bottom: 0,
    right: 2,
  },
});

const Item: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View>
        <Image
          source={{
            uri: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t1.6435-1/141995787_512358293071430_1466381692630381917_n.jpg?stp=dst-jpg_s320x320&_nc_cat=111&ccb=1-7&_nc_sid=7206a8&_nc_ohc=9JU-HVeBW-YAX_Uinm_&_nc_ht=scontent.fsgn19-1.fna&oh=00_AfDDgoNUaoowtfVmK9nM693BZ7rkzQhYTCkvgFigIV9R7Q&oe=64D81B8D",
          }}
          style={styles.img}
        >
          {/* <View style={styles.span}></View> */}
        </Image>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>Riven </Text>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.content_message}
        >
          Have a nice new dayaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </Text>
      </View>
      <Text style={styles.status}>now </Text>
    </View>
  );
};

export default Item;
