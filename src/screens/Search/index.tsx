import { Avatar, Button } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Searchbar } from "react-native-paper";
import { ScrollView } from "react-native";

import { global_styles } from "../../../style";
import { Ionicons } from "@expo/vector-icons";
import Item from "./Item";
import SearchBar from "../../Component/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { filter } from "../../redux/slice/userSlice";
import Loading from "../../Component/Loading";

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  item: {
    width: 100,
    display: "flex",
    textAlign: "center",
  },
  search_bar: {
    backgroundColor: "#f0f0f0",
    flex: 1,
    height: undefined,
    borderRadius: 30,
    color: "#3C3C43",
  },
  items: {
    flex: 1,
    marginTop: 20,
  },
});
const Index: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state: any) => {
    return state.user.status;
  });
  const listUser = useSelector((state: any) => {
    return state.user.listUser;
  });
  const listFilter = useSelector((state: any) => {
    return state.user.listFiltered;
  });

  const handleSearch = (keyword: string) => {
    if (listUser && keyword) {
      const filteredItems = listUser.filter((item: any) => {
        for (let tmp of Object.keys(item)) {
          if (
            typeof item[tmp] === "string" &&
            item[tmp].toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      dispatch(filter(filteredItems));
    }
  };

  return (
    <View style={global_styles.wrapper}>
      {isLoading == "loading" && <Loading />}
      <View style={[global_styles.rowCenter]}>
        <Ionicons name="arrow-back-outline" size={25} color="black" />
        <SearchBar setSearchPhrase={handleSearch} />
      </View>
      <View style={styles.items}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {listFilter &&
            listFilter.map((item: any, index: any) => {
              return <Item key={index} item={item} />;
            })}
        </ScrollView>
      </View>
    </View>
  );
};

export default Index;
