// SearchBar.js
import React, { FC, useState } from "react";
import { StyleSheet, TextInput, View, Keyboard, Button } from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { itemColor } from "../../../style";

interface Type {
  clicked?: boolean | undefined;
  searchPhrase?: string | undefined;
  setSearchPhrase: (phrase: string) => void;
}
const SearchBar: React.FC<Type> = ({
  clicked,
  searchPhrase,
  setSearchPhrase,
}) => {
  const [click, setClicked] = useState(false);
  return (
    <View style={styles.container}>
      <View
        style={
          clicked ? styles.searchBar__clicked : styles.searchBar__unclicked
        }
      >
        <Ionicons
          name="search"
          size={20}
          color="black"
          style={{ marginLeft: 1, opacity: 0.6 }}
        />
        <TextInput
          selectionColor={"rgb(0, 149, 246)"}
          style={styles.input}
          placeholder="Search"
          value={searchPhrase}
          onChangeText={(text) => {
            setSearchPhrase(text);
          }}
          onFocus={() => {
            setClicked(true);
          }}
        />
        {clicked && (
          <Entypo
            name="cross"
            size={20}
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase("");
            }}
          />
        )}
      </View>
      {clicked && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setClicked(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: 40,
    flex: 1,
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: "row",
    width: "95%",
    backgroundColor: "#d9dbda",
    borderRadius: 15,
    alignItems: "center",
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: "row",

    width: "80%",
    backgroundColor: itemColor,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    width: "90%",
  },
});
