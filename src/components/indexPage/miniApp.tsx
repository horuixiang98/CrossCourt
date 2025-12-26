import { Colors } from "@/constants/theme";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

function MiniApp() {
  return (
    <View style={{ paddingVertical: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <Text style={styles.title}>Mini Applications</Text>
        <Feather
          name="more-horizontal"
          size={18}
          color="#222222b7"
          style={{ marginTop: 5 }}
        />
      </View>
      <ScrollView horizontal={true}>
        <View style={styles.BorderBackground}>
          <Text
            style={[
              styles.NewBadge,
              { fontSize: 10, fontWeight: "bold", alignSelf: "flex-start" },
            ]}
          >
            New Feature
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#222222b7",
              paddingVertical: 5,
            }}
          >
            Scoreboard
          </Text>
          <Text style={styles.Subtitle}>
            Track your match score and get instant insights on your performance.
          </Text>
          <Image
            source={require("@/assets/images/scoreboard.png")}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
              alignSelf: "flex-end",
            }}
          />
        </View>
        <View style={styles.BorderBackground}>
          <Text
            style={[
              styles.RecommendedBadge,
              { fontSize: 10, fontWeight: "bold", alignSelf: "flex-start" },
            ]}
          >
            Recommended
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#222222b7",
              paddingVertical: 5,
            }}
          >
            Training
          </Text>
          <Text style={styles.Subtitle}>
            Improve skills and performance with personalized training modules.
          </Text>
          <Image
            source={require("@/assets/images/training.png")}
            resizeMode="contain"
            style={{
              width: 100,
              height: 100,
              alignSelf: "flex-end",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default MiniApp;

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1c1c1cb7",
    paddingBottom: 10,
  },
  BorderBackground: {
    marginRight: 10,
    padding: 12,
    borderRadius: 10,
    width: windowWidth / 2.2,
    backgroundColor: Colors.light.lightgray2,
  },
  NewBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#ffc3c35f",
    textAlign: "center",
    color: "#ff0000b7",
  },
  RecommendedBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: "#c8eeff6e",
    textAlign: "center",
    color: "#205fffb7",
  },
  Subtitle: {
    fontSize: 10,
    color: "#22222280",
  },
});
