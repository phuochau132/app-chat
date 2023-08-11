import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  fontColor,
} from "../../../../style";
import {useSelector } from "react-redux";
import LinearGradientWrapper from "../../../Component/LinearGradientWrapper";
import Item from "./Item";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const LikesModal: React.FC<{ idPost: number; event: any }> = ({
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
      <View>
        <Ionicons
          onPress={event}
          name="arrow-back-outline"
          size={25}
          color={fontColor}
        />
      </View>
      <View>
        {post[0].likedUsers.map((item: any) => {
          return <Item item={item} />;
        })}
      </View>
    </LinearGradientWrapper>
  );
};

export default LikesModal;
