import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  CommonActions,
  StackActions,
  useNavigation,
} from "@react-navigation/native";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { fontColor, global_styles } from "../../../style";
import Item from "./Item";
import SearchBar from "../../Component/SearchBar";
import { filter } from "../../redux/slice/userSlice";
import Loading from "../../Component/Loading";
import LinearGradientWrapper from "../../Component/LinearGradientWrapper";

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
    borderRadius: 30,
    color: "#3C3C43",
  },
  items: {
    marginTop: 20,
  },
});

const Index: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState("");
  const user = useSelector((state: any) => {
    return state.auth.user;
  });
  const listUser = useSelector((state: any) => {
    return state.user.listUser;
  });
  const listFilter = useSelector((state: any) => {
    return state.user.listFiltered;
  });

  const handleSearch = (keyword: string) => {
    setIsLoading("loading");
    if (listUser && keyword) {
      const filteredItems = listUser.filter((item: any) => {
        for (let tmp of Object.keys(item)) {
          if (
            typeof item[tmp] === "string" &&
            item.id != user.id &&
            item[tmp].toLocaleLowerCase().includes(keyword.toLocaleLowerCase())
          ) {
            return true;
          }
        }
        return false;
      });
      dispatch(filter(filteredItems));
    }
    setIsLoading("success");
  };
  const changeScreen = (item: any) => {
    navigation.navigate("userProfile", { item: JSON.stringify(item) });
  };
  return (
    <LinearGradientWrapper>
      {isLoading == "loading" && <Loading />}
      <View style={global_styles.wrapper}>
        <View style={[global_styles.rowCenter]}>
          <TouchableOpacity>
            <Ionicons
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "tabHome" }],
                  })
                );
              }}
              name="arrow-back-outline"
              size={25}
              color={fontColor}
            />
          </TouchableOpacity>
          <SearchBar setSearchPhrase={handleSearch} />
        </View>
        <View style={styles.items}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {listFilter &&
              listFilter.map((item: any, index: any) => {
                return (
                  <Item
                    onPress={() => {
                      changeScreen(item);
                    }}
                    key={index}
                    item={item}
                  />
                );
              })}
          </ScrollView>
        </View>
      </View>
    </LinearGradientWrapper>
  );
};
export default Index;
