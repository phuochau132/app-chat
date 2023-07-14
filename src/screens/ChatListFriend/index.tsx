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

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    color: "black",
    display: "flex",
    justifyContent: "center",
  },
  row_center: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  text: {
    fontWeight: "bold",
    marginTop: 20,
  },
  header: {
    backgroundColor: "#F2F2F2",
  },
  items: {
    marginTop: 20,
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  const [valueSearch, setValueSearch] = useState("");
  const handleTextSearch = (e: any) => {
    setValueSearch(e.target.value);
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={100}
    >
      <View style={styles.row_center}>
        <Ionicons name="chevron-back" size={30} color="black" />
        <Text style={{ fontSize: 20 }}>Riven</Text>
        <Ionicons name="add" size={30} color="black" />
      </View>
      <Searchbar
        style={{
          backgroundColor: "#D4D4DA",
          opacity: 0.4,
          borderRadius: 15,
          color: "#3C3C43",
        }}
        onChangeText={(e) => {
          handleTextSearch(e);
        }}
        value={valueSearch}
        placeholder="Search"
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.items}>
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
    </KeyboardAvoidingView>
  );
};

export default Index;
