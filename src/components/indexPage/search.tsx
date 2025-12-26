import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

function Search() {
  const [searchText, setSearchText] = useState("");

  const handleClear = () => {
    setSearchText("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Feather
          name="search"
          size={20}
          color="#22222280"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search for players, courts, or events..."
          placeholderTextColor="#22222280"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Feather name="x-circle" size={10} color="#22222280" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Search;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.lightgray,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.title,
  },
  clearButton: {
    padding: 4,
  },
});
