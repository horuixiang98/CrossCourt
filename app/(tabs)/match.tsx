import { Trophy } from "lucide-react-native";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function MatchScreen() {
  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Glow Decorations */}
        <View style={styles.topGlow} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>赛事中心</Text>
            <Text style={styles.headerSubtitle}>挑战自我，成就传奇</Text>
          </View>
          <View style={styles.headerIcon}>
            <Trophy size={24} color="#10b981" />
          </View>
        </View>

        <View style={styles.placeholderContainer}>
          <Trophy size={64} color="rgba(16, 185, 129, 0.2)" />
          <Text style={styles.placeholderText}>暂无可参加的赛事</Text>
          <Text style={styles.placeholderSubtext}>
            新的赛季即将开始，敬请期待
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderRadius: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc",
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    marginTop: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f8fafc",
    marginTop: 24,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 8,
  },
});
