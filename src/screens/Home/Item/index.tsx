import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "@rneui/themed";
import moment from "moment";
import { fontColor, global_styles, itemColor } from "../../../../style";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dislikePost, likePost } from "../../../redux/slice/postSlice";
import Avatar from "../../../Component/Avatar";

const styles = StyleSheet.create({
  icon: {
    color: fontColor,
    marginRight: 2,
    fontSize: 25,
  },
});

const height = 100;
const width = 100;
const Item: React.FC<{
  eventOnLikesModal: any;
  item: any;
  eventOnCommentModal: any;
}> = ({ item, eventOnLikesModal, eventOnCommentModal }) => {
  console.log(process.env.HOST_SERVER + item.user.avatar);
  const [listImg, setListImg] = useState(item.imgPosts);
  const [comment, setListComment] = useState(item.comments);
  console.log(123);
  const [index, setIndex] = useState(1);
  const user = useSelector((state: any) => state.auth.user);
  console.log(user);

  const posts = useSelector((state: any) => state.post.posts);
  const dispatch = useDispatch();
  const getLengthWidth = () => {
    if (listImg.length == 1) {
      return width;
    } else {
      return width / 2;
    }
  };
  const getLengthHeight = () => {
    if (listImg.length == 1) {
      return height;
    } else {
      return height / Math.ceil(listImg.length / 2);
    }
  };
  const handleLike = () => {
    dispatch(likePost({ idPost: item.id, idUser: user.id }));
  };
  const handleDisLike = () => {
    dispatch(dislikePost({ idPost: item.id, idUser: user.id }));
  };

  const toggleIndex = (index: Number) => [setIndex(Number)];
  return (
    <View
      style={[
        global_styles.ColumnCenter,
        {
          width: "100%",
          height: "auto",
          padding: 20,
          backgroundColor: itemColor,
          marginTop: 20,
          borderRadius: 20,
        },
      ]}
    >
      <View style={[global_styles.rowCenter, { marginBottom: 5 }]}>
        <View style={[global_styles.rowCenter]}>
          <Avatar
            avatar={process.env.HOST_SERVER + item.user.avatar}
            isActive={false}
          />
        </View>
        <View
          style={[
            global_styles.ColumnCenter,
            { flex: 1, alignItems: "flex-start", marginLeft: 10 },
          ]}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16, color: fontColor }}>
            {item.user.nickName}
          </Text>
          <Text style={{ opacity: 0.6, fontSize: 12, color: fontColor }}>
            {moment(item.createAt).fromNow()}
          </Text>
        </View>
      </View>
      <Text
        style={[
          global_styles.text,
          {
            fontSize: 15,
            marginTop: 10,
            textAlign: "left",
            width: "100%",
          },
        ]}
      >
        {item.text}
      </Text>
      <View
        style={[
          global_styles.rowCenter,
          {
            marginTop: 20,
            flexWrap: "wrap",
            height: 320,
          },
        ]}
      >
        {listImg.map((item: any, index: number) => {
          if (index < 3) {
            return (
              <View
                key={index}
                style={{
                  marginTop: 30,
                  width: `${getLengthWidth() - 2}%`,
                  height: `${getLengthHeight() - 2}%`,
                  marginRight: 2,
                  marginLeft: 2,
                  overflow: "hidden",
                }}
              >
                <Image
                  onPress={() => {
                    toggleIndex(index);
                  }}
                  source={{
                    uri: process.env.HOST_SERVER + item.urlImg,
                  }}
                  style={{
                    borderRadius: 10,
                    width: `100%`,
                    height: `100%`,
                    marginRight: 2,
                    marginLeft: 2,
                  }}
                ></Image>
              </View>
            );
          }
          if (index == 3) {
            return (
              <View
                key={index}
                style={{
                  position: "relative",
                  width: `${getLengthWidth() - 2}%`,
                  height: `${getLengthHeight() - 2}%`,
                  marginRight: 2,
                  marginLeft: 2,
                }}
              >
                <Image
                  onPress={() => {
                    toggleIndex(index);
                  }}
                  source={{
                    uri: item,
                  }}
                  style={{
                    borderRadius: 10,
                    width: `100%`,
                    height: `100%`,
                  }}
                >
                  <Text
                    style={{
                      position: "absolute",
                      color: "white",
                      top: 44,
                      left: 55,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    {listImg.length - 4}
                  </Text>
                </Image>
              </View>
            );
          }
        })}
      </View>
      <View
        style={[
          global_styles.rowCenterBetween,
          { width: "95%", marginTop: 40 },
        ]}
      >
        <View style={[global_styles.rowCenter]}>
          <View style={[global_styles.rowCenter, { marginRight: 20 }]}>
            {posts.find((item: any) => {
              return item.likedUsers.some((e: any) => e.id === user.id);
            }) ? (
              <Ionicons
                onPress={handleDisLike}
                style={[styles.icon, { color: "#f84f6b" }]}
                name="heart-circle-outline"
              />
            ) : (
              <Ionicons
                onPress={handleLike}
                style={styles.icon}
                name="heart-outline"
              />
            )}
            <View>
              <TouchableOpacity
                onPress={() => {
                  eventOnLikesModal(item.id);
                }}
              >
                <Text style={[global_styles.text, { marginLeft: 10 }]}>
                  {item.likedUsers.length}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={[global_styles.rowCenter, { marginRight: 20 }]}>
            <Ionicons name="chatbubble-ellipses-outline" style={styles.icon} />
            <TouchableOpacity
              onPress={() => {
                eventOnCommentModal(item.id);
              }}
            >
              <Text style={[global_styles.text, { marginLeft: 10 }]}>
                {comment.length}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Ionicons name="return-up-forward" style={styles.icon} />
      </View>
    </View>
  );
};

export default Item;
