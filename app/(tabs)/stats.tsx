import {
  ArrowRight,
  Filter,
  Globe,
  MapPin,
  TrendingDown,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const TOP_PLAYERS = [
  {
    id: 1,
    name: "张小羽",
    elo: 2450,
    change: +12,
    trend: "up",
    avatar: "⚡",
    rank: 1,
    winRate: "82%",
    title: "浦东球王",
  },
  {
    id: 2,
    name: "林克",
    elo: 2380,
    change: -5,
    trend: "down",
    avatar: "🔥",
    rank: 2,
    winRate: "78%",
    title: "连胜大师",
  },
  {
    id: 3,
    name: "陈大力",
    elo: 2310,
    change: +25,
    trend: "up",
    avatar: "💎",
    rank: 3,
    winRate: "75%",
    title: "潜力新星",
  },
  {
    id: 4,
    name: "王阿姨",
    elo: 2150,
    change: 0,
    trend: "stable",
    avatar: "🏸",
    rank: 4,
    winRate: "70%",
    title: "稳如老狗",
  },
  {
    id: 5,
    name: "羽球王子",
    elo: 2120,
    change: +8,
    trend: "up",
    avatar: "👑",
    rank: 5,
    winRate: "68%",
    title: "技术流",
  },
  {
    id: 6,
    name: "李雷",
    elo: 2050,
    change: -12,
    trend: "down",
    avatar: "🌟",
    rank: 6,
    winRate: "65%",
    title: "活跃达人",
  },
];

export default function RankingScreen() {
  const [activeTab, setActiveTab] = useState("local");

  return (
    <View style={styles.mainContainer}>
      {/* Background Glows */}
      <View style={styles.topGlow} />
      <View style={styles.bottomGlow} />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleGroup}>
            {/* <TouchableOpacity style={styles.backButton}>
              <ChevronLeft size={20} color="#f8fafc" />
            </TouchableOpacity> */}
            <View>
              <Text style={styles.headerTitleText}>RANKING</Text>
              <Text style={styles.headerSeason}>SEASON 04</Text>
            </View>
          </View>
          {/* <TouchableOpacity style={styles.iconButton}>
            <Search size={18} color="#94a3b8" />
          </TouchableOpacity> */}
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 140 }}
        >
          {/* Region Card */}
          <View style={styles.regionCard}>
            <View style={styles.regionHeader}>
              <View style={styles.regionIconRow}>
                <View style={styles.regionIconContainer}>
                  <MapPin size={24} color="#fff" />
                </View>
                <View>
                  <View style={styles.regionLabelRow}>
                    <Text style={styles.regionLabelText}>当前赛季赛区</Text>
                    <View style={styles.pulseDot} />
                  </View>
                  <Text style={styles.regionName}>
                    上海 · 浦东新区{" "}
                    <Zap size={14} color="#facc15" fill="#facc15" />
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeButton}>
                <Text style={styles.changeButtonText}>更换</Text>
              </TouchableOpacity>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                onPress={() => setActiveTab("local")}
                style={[
                  styles.tabButton,
                  activeTab === "local" && styles.tabButtonActive,
                ]}
              >
                <Trophy
                  size={14}
                  color={activeTab === "local" ? "#000" : "#64748b"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "local" && styles.tabButtonTextActive,
                  ]}
                >
                  本地排行
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("global")}
                style={[
                  styles.tabButton,
                  activeTab === "global" && styles.tabButtonActive,
                ]}
              >
                <Globe
                  size={14}
                  color={activeTab === "global" ? "#000" : "#64748b"}
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    activeTab === "global" && styles.tabButtonTextActive,
                  ]}
                >
                  全球精英
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Champion Section */}
          {activeTab === "local" && (
            <View style={styles.championContainer}>
              <TouchableOpacity style={styles.championCard} activeOpacity={0.9}>
                <View style={styles.championContent}>
                  <View style={styles.championBadge}>
                    <Text style={styles.championBadgeText}>
                      REGIONAL CHAMPION
                    </Text>
                  </View>
                  <View style={styles.championNameRow}>
                    <Text style={styles.championName}>
                      {TOP_PLAYERS[0].name}
                    </Text>
                    <View style={styles.zapSmall}>
                      <Zap size={10} color="#000" fill="#000" />
                    </View>
                  </View>
                  <View style={styles.eloContainer}>
                    <Text style={styles.eloValue}>{TOP_PLAYERS[0].elo}</Text>
                    <Text style={styles.eloLabel}>ELO POINTS</Text>
                  </View>
                </View>

                <View style={styles.medalWrapper}>
                  <View style={styles.medalContainer}>
                    <Text style={styles.medalIcon}>🥇</Text>
                  </View>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankBadgeText}>#01</Text>
                  </View>
                </View>

                <View style={styles.topBgText}>
                  <Text style={styles.topBgTextContent}>TOP</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* List Header */}
          <View style={styles.listHeader}>
            <View>
              <Text style={styles.listHeaderText}>THE ELITE</Text>
              <Text style={styles.listHeaderSub}>前 100 名顶尖选手</Text>
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={16} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          {/* Player List */}
          <View style={styles.playerList}>
            {TOP_PLAYERS.slice(1).map((player, index) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerItem}
                activeOpacity={0.7}
              >
                <View style={styles.playerLeft}>
                  <View style={styles.avatarContainer}>
                    <View
                      style={[
                        styles.avatarBox,
                        index === 0
                          ? styles.silverBox
                          : index === 1
                          ? styles.bronzeBox
                          : styles.defaultBox,
                      ]}
                    >
                      <Text style={styles.avatarEmoji}>{player.avatar}</Text>
                    </View>
                    <View
                      style={[
                        styles.rankNumberCircle,
                        index === 0
                          ? styles.silverCircle
                          : index === 1
                          ? styles.bronzeCircle
                          : styles.defaultCircle,
                      ]}
                    >
                      <Text style={styles.rankNumberText}>{player.rank}</Text>
                    </View>
                  </View>

                  <View style={styles.playerInfo}>
                    <View style={styles.playerNameRow}>
                      <Text style={styles.playerName}>{player.name}</Text>
                      <View style={styles.titleBadge}>
                        <Text style={styles.titleBadgeText}>
                          {player.title}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.winRateRow}>
                      <View style={styles.winRateDot} />
                      <Text style={styles.winRateText}>
                        WIN RATE {player.winRate}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.playerRight}>
                  <View style={styles.eloBox}>
                    <Text style={styles.playerElo}>{player.elo}</Text>
                    <View style={styles.trendRow}>
                      {player.trend === "up" && (
                        <TrendingUp size={10} color="#10b981" />
                      )}
                      {player.trend === "down" && (
                        <TrendingDown size={10} color="#ef4444" />
                      )}
                      <Text
                        style={[
                          styles.trendValue,
                          player.trend === "up"
                            ? { color: "#10b981" }
                            : player.trend === "down"
                            ? { color: "#ef4444" }
                            : { color: "#64748b" },
                        ]}
                      >
                        {player.change !== 0 ? Math.abs(player.change) : "-"}
                      </Text>
                    </View>
                  </View>
                  <ArrowRight size={16} color="#1e293b" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 100,
  },
  bottomGlow: {
    position: "absolute",
    bottom: height * 0.2,
    left: -width * 0.2,
    width: width * 0.6,
    height: height * 0.3,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(5, 5, 5, 0.6)",
  },
  headerTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  headerSeason: {
    fontSize: 10,
    fontWeight: "800",
    color: "#10b981",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: -2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingHorizontal: 24,
  },
  regionCard: {
    marginTop: 8,
    marginBottom: 32,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  regionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  regionIconRow: {
    flexDirection: "row",
    gap: 12,
  },
  regionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#10b981",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  regionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 2,
  },
  regionLabelText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pulseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#10b981",
  },
  regionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
  },
  changeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  changeButtonText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
  },
  tabButtonTextActive: {
    color: "#000",
  },
  championContainer: {
    marginBottom: 42,
    position: "relative",
    shadowColor: "#5df0bfb6",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  championCard: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
  },
  championContent: {
    zIndex: 2,
  },
  championBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  championBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#10b981",
    letterSpacing: 2,
  },
  championNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  championName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
  },
  zapSmall: {
    width: 20,
    height: 20,
    backgroundColor: "#facc15",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  eloContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
  },
  eloValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
  },
  eloLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
  },
  medalWrapper: {
    position: "relative",
    zIndex: 2,
  },
  medalContainer: {
    width: 96,
    height: 96,
    backgroundColor: "rgba(16, 185, 129, 0.6)",
    borderRadius: 24,
    transform: [{ rotate: "12deg" }],
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  medalIcon: {
    fontSize: 48,
    transform: [{ rotate: "-12deg" }],
  },
  rankBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  rankBadgeText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#000",
    fontStyle: "italic",
  },
  topBgText: {
    position: "absolute",
    left: -16,
    bottom: -32,
    opacity: 0.02,
  },
  topBgTextContent: {
    fontSize: 120,
    fontWeight: "900",
    fontStyle: "italic",
    color: "#fff",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  listHeaderText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  listHeaderSub: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 1)",
    justifyContent: "center",
    alignItems: "center",
  },
  playerList: {
    gap: 16,
  },
  playerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 24,
  },
  playerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  silverBox: { backgroundColor: "#e2e8f0" },
  bronzeBox: { backgroundColor: "#ffedd5" },
  defaultBox: { backgroundColor: "#1e293b" },
  avatarEmoji: { fontSize: 24 },
  rankNumberCircle: {
    position: "absolute",
    top: -8,
    left: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },
  silverCircle: { backgroundColor: "#cbd5e1" },
  bronzeCircle: { backgroundColor: "#fdba74" },
  defaultCircle: { backgroundColor: "#334155" },
  rankNumberText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#000",
  },
  playerInfo: {
    gap: 2,
  },
  playerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  titleBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  titleBadgeText: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "600",
  },
  winRateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  winRateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(16, 185, 129, 0.5)",
  },
  winRateText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
  },
  playerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  eloBox: {
    alignItems: "flex-end",
  },
  playerElo: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 4,
  },
  trendValue: {
    fontSize: 10,
    fontWeight: "900",
  },
});
