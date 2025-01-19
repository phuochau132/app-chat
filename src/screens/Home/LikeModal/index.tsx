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

const LikesModal: React.FC<{ idPost: number | undefined; event: any }> = ({
  idPost,
  event,
}) => {
  const posts = useSelector((state: any) => state.post.posts);
  const navigation = useNavigation();
  const post = posts.filter((item: any) => {
    return item.id === idPost;
  });

  return (
    <LinearGradientWrapper>
      <View style={global_styles.rowCenter}>
        <Ionicons
          onPress={event}
          name="arrow-back-outline"
          size={25}
          color={fontColor}
        />
        <Text style={global_styles.title}>Like</Text>
      </View>
      <View>
        {post[0].likedUsers.map((item: any, index: number) => {
          return <Item key={index} item={item} />;
        })}
      </View>
    </LinearGradientWrapper>
  );
};

export default LikesModal;
