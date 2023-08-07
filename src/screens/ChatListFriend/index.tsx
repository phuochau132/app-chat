import { Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Image } from "@rneui/themed";
import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { useState } from "react";

import Item from "./Item";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";
import SearchBar from "../../Component/SearchBar";
import { fontColor, global_styles } from "../../../style";
import { useSelector } from "react-redux";

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
    marginTop: 20,
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  const [valueSearch, setValueSearch] = useState("");
  const user = useSelector((state: any) => state.auth.user);
  const handleTextSearch = (text: string) => {
    console.log(text);
    setValueSearch(text);
  };
  return (
    <LinearGradientWrapper>
      <View style={[global_styles.rowCenterBetween, { marginTop: 20 }]}>
        <Ionicons name="chevron-back" size={30} color={fontColor} />
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
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
          <Item></Item>
        </ScrollView>
      </View>
    </LinearGradientWrapper>
  );
};

export default Index;
