import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import Item from "./Item";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
import SearchBar from "../../Component/SearchBar";
import { fontColor, global_styles } from "../../../style";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../../redux/slice/userSlice";

const styles = StyleSheet.create({
  text: {
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    backgroundColor: "#F2F2F2",
  },
  items: {
    flex: 1,
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  const [valueSearch, setValueSearch] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const friends = useSelector((state: any) => state.user.friends);
  const dispatch = useDispatch();
  const handleTextSearch = (text: string) => {
    setValueSearch(text);
  };

  return (
    <LinearGradientWrapper>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <Ionicons
          onPress={navigation.goBack}
          name="arrow-back-outline"
          size={30}
          color={fontColor}
        />
        <Text style={[global_styles.title, { fontSize: 24 }]}>
          {user.nickName}
        </Text>
        <Ionicons name="add" size={30} color={fontColor} />
      </View>
      <View style={{ height: "10%" }}>
        <SearchBar setSearchPhrase={handleTextSearch} />
      </View>
      <View style={styles.items}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {friends.map((item: any, index: number) => {
            return <Item key={index} item={item} />;
          })}
        </ScrollView>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
