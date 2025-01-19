import { StyleSheet, View } from "react-native";
import { Image, Text } from "react-native-elements";
import { global_styles, itemColor } from "../../../../style";
import Avatar from "../../../Component/Avatar";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  bubbleContainer: {
    maxWidth: 380,
    padding: 8,
    paddingHorizontal: 13,
    borderRadius: 10,
    marginTop: 10,
  },
  fromMe: {
    alignSelf: "flex-end",
    backgroundColor: "#39414b",
  },
  toMe: {
    alignSelf: "flex-start",

    backgroundColor: itemColor,
  },
  messageText: {
    fontSize: 16,
  },
});
export const Bubble: React.FC<{ data: Object; isToMe: boolean }> = ({
  data,
  isToMe,
}) => {
  const bubbleStyle = isToMe ? styles.toMe : styles.fromMe;
  const flex = isToMe ? "flex-start" : "flex-end";
  const dateObject = new Date(data.createdAt);
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  return (
    <View
      style={[
        styles.container,
        bubbleStyle,
        { backgroundColor: "transparent", marginTop: 10 },
      ]}
    >
      <View style={[global_styles.rowCenter, { justifyContent: flex }]}>
        {isToMe && (
          <Avatar
            user={data.user}
            size={{ height: 50, width: 50, marginRight: 5 }}
          ></Avatar>
        )}
        <View style={[styles.bubbleContainer, bubbleStyle]}>
          <Text style={[styles.messageText, { color: "white" }]}>
            {data.text}
          </Text>
        </View>
      </View>

      <View style={[global_styles.rowCenter, { width: "50%" }]}>
        <View
          style={[
            global_styles.rowCenter,
            {
              marginTop: 10,
              height: "auto",
              flexWrap: "wrap",
              flex: 1,
              justifyContent: flex,
            },
          ]}
        >
          {data.image?.map((item: string, index: number) => {
            return (
              <Image
                key={index}
                source={{
                  uri: item,
                }}
                style={{
                  borderRadius: 10,
                  width: 70,
                  height: 70,
                }}
              ></Image>
            );
          })}
        </View>
      </View>
      <Text
        style={[
          bubbleStyle,
          { color: "hsl(210,8%,75%)", backgroundColor: "transparent" },
        ]}
      >
        {hours + ":" + minutes}
      </Text>
    </View>
  );
};

export default Bubble;
