import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontColor, global_styles } from "../../../../style";
import { useSelector } from "react-redux";
import LinearGradientWrapper from "../../../Component/LinearGradientWrapper";
import Item from "./Item";
import { Text } from "react-native-elements";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const FriendsModal: React.FC<{ userId: number; event: any }> = ({
  userId,
  event,
}) => {
  const friends = useSelector((state: any) => state.user.friends);
  return (
    <LinearGradientWrapper>
      <View style={global_styles.rowCenterBetween}>
        <View>
          <Ionicons
            onPress={event}
            name="arrow-back-outline"
            size={25}
            color={fontColor}
          />
        </View>
        <Text style={[global_styles.title, { fontSize: 25 }]}>Bạn bè</Text>
      </View>
      {friends.length > 0 ? (
        <View>
          {friends.map((item: any, index: number) => {
            return <Item key={index} item={item.user} />;
          })}
        </View>
      ) : (
        <View
          style={[global_styles.ColumnCenter, { flex: 1, marginBottom: 60 }]}
        >
          <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
            Không có bạn bè để hiển thị!
          </Text>
        </View>
      )}
    </LinearGradientWrapper>
  );
};

export default FriendsModal;
