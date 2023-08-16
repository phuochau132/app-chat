import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { fontColor, global_styles } from "../../../../style";
import { useSelector } from "react-redux";
import LinearGradientWrapper from "../../../Component/LinearGradientWrapper";
import Item from "../../Home/Item";
import CommentModal from "../../Home/CommentModal";
import LikesModal from "../FriendsModal";
import { useEffect, useState } from "react";
import { Text } from "react-native-elements";
import axios from "axios";
import axiosInstance from "../../../config/axiosConfig";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const PostsModal: React.FC<{ userId: number; event: any; data: any[] }> = ({
  userId,
  event,
  data,
}) => {
  const navigation = useNavigation();
  const user = useSelector((state: any) => state.auth.user);
  const [idPost, setIdPost] = useState<number>();

  const [isModalLikesVisible, setModalLikesVisible] = useState<boolean>(false);
  const [isCommentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  console.log("123", data);

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
        <Text style={[global_styles.title, { fontSize: 25 }]}>Bài đăng</Text>
      </View>
      {data.length > 0 ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              {data.map((item: any, index: number) => {
                return (
                  <Item
                    key={index}
                    item={item}
                    eventOnLikesModal={(id: number) => {
                      setIdPost(id);
                      setModalLikesVisible(!isModalLikesVisible);
                    }}
                    eventOnCommentModal={(id: number) => {
                      setIdPost(id);
                      setCommentModalVisible(!isCommentModalVisible);
                    }}
                  />
                );
              })}
            </View>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModalLikesVisible}
          >
            <LikesModal
              idPost={idPost}
              event={() => {
                setModalLikesVisible(!isModalLikesVisible);
              }}
            />
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={isCommentModalVisible}
          >
            <CommentModal
              idPost={idPost}
              event={() => {
                setCommentModalVisible(!isCommentModalVisible);
              }}
            />
          </Modal>
        </>
      ) : (
        <View
          style={[global_styles.ColumnCenter, { flex: 1, marginBottom: 60 }]}
        >
          <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
            Không có bài đăng nào để hiển thị!
          </Text>
        </View>
      )}
    </LinearGradientWrapper>
  );
};

export default PostsModal;
