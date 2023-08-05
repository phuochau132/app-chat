import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Image } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import {
  backgroundColor,
  fontColor,
  global_styles,
  itemColor,
} from "../../../../style";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dislikePost, likePost } from "../../../redux/slice/postSlice";
import LinearGradientWrapper from "../../../Component/LinearGradientWrapper";
import Item from "./Item";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const ModalLike: React.FC<{ idPost: number }> = ({ idPost }) => {
  const posts = useSelector((state: any) => state.post.posts);
  const post = posts.filter((item: any) => {
    return item.id === idPost;
  });

  return (
    <LinearGradientWrapper>
      <View>
        {post[0].likedUsers.map((item: any) => {
          return <Item item={item} />;
        })}
      </View>
    </LinearGradientWrapper>
  );
};

export default ModalLike;
