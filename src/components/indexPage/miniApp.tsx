import { MoreHorizontal } from "lucide-react-native";
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
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={styles.title}>MINI APPLICATIONS</Text>
        <MoreHorizontal size={20} color="#64748b" />
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.BorderBackground}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.NewBadge}>New Feature</Text>
          </View>
          <Text style={styles.cardTitle}>Scoreboard</Text>
          <Text style={styles.Subtitle}>
            Track match score and get instant insights on performance.
          </Text>
          <Image
            source={require("@/assets/images/scoreboard.png")}
            resizeMode="contain"
            style={styles.cardImage}
          />
        </View>
        <View style={styles.BorderBackground}>
          <View style={styles.badgeWrapper}>
            <Text style={styles.RecommendedBadge}>Recommended</Text>
          </View>
          <Text style={styles.cardTitle}>Training</Text>
          <Text style={styles.Subtitle}>
            Improve skills with personalized training modules.
          </Text>
          <Image
            source={require("@/assets/images/training.png")}
            resizeMode="contain"
            style={styles.cardImage}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default MiniApp;

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  BorderBackground: {
    marginRight: 12,
    padding: 16,
    borderRadius: 16,
    width: windowWidth / 2.2,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  badgeWrapper: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  NewBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    fontSize: 9,
    fontWeight: "bold",
    color: "#ef4444",
    textTransform: "uppercase",
  },
  RecommendedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    fontSize: 9,
    fontWeight: "bold",
    color: "#3b82f6",
    textTransform: "uppercase",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#f8fafc",
    marginBottom: 4,
  },
  Subtitle: {
    fontSize: 10,
    color: "#64748b",
    lineHeight: 14,
    fontWeight: "500",
  },
  cardImage: {
    width: 80,
    height: 80,
    alignSelf: "flex-end",
    marginTop: 8,
    opacity: 0.8,
  },
});
