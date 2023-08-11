import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  fontColor,
  fontColorItem,
  global_styles,
  placeholderTextColor,
} from "../../../../style";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addComment, dislikePost } from "../../../redux/slice/postSlice";
import LinearGradientWrapper from "../../../Component/LinearGradientWrapper";
import Item from "./Item";
import { TextInput } from "react-native-paper";
import Loading from "../../../Component/Loading";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
  textInput: {
    backgroundColor: "rgba(133,126,117,255)",
    color: "white",
    borderRadius: 10,
    height: 40,
    marginRight: 10,
    flex: 1,
  },
});

const CommentModal: React.FC<{ idPost: number; event: any }> = ({
  idPost,
  event,
}) => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const posts = useSelector((state: any) => state.post.posts);
  const status = useSelector((state: any) => state.post.status);
  const user = useSelector((state: any) => state.auth.user);
  const post = posts.filter((item: any) => {
    return item.id === idPost;
  });

  const handleAddComment = () => {
    dispatch(
      addComment({
        userId: user.id,
        postId: post[0].id,
        parentCommentId: -1,
        text: text,
      })
    );
  };
  useEffect(() => {
    setText("");
  }, [status]);
  return (
    <LinearGradientWrapper>
      {status == "loading" && <Loading></Loading>}
      <View style={global_styles.rowCenter}>
        <Ionicons
          onPress={event}
          name="arrow-back-outline"
          size={25}
          color={fontColor}
        />
        <Text style={global_styles.title}>Comment</Text>
      </View>
      <View
        style={[global_styles.rowCenter, { marginTop: 10, marginBottom: 10 }]}
      >
        <TextInput
          onChangeText={(text: string) => {
            setText(text);
          }}
          placeholderTextColor={placeholderTextColor}
          focusable={false}
          style={styles.textInput}
          selectionColor={fontColorItem}
          placeholder="Viết bình luận..."
          textColor="white"
          value={text}
        />
        <TouchableOpacity onPress={handleAddComment}>
          <Ionicons name="send-outline" size={25} color={fontColor} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {post[0].comments.map((item: any, index: number) => {
          if (!item.parentCommentId) {
            return <Item key={index} margin={0} item={item} />;
          }
        })}
      </ScrollView>
    </LinearGradientWrapper>
  );
};

export default CommentModal;
