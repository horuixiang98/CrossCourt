import MiniApp from "@/src/components/indexPage/miniApp";
import { useSession } from "@/src/providers/SessionProvider";
import {
  getPlayerProfile,
  getPlayerStats,
  PlayerStats,
} from "@/src/services/playerProfileService";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Activity,
  Award,
  Bell,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  Heart,
  MessageSquare,
  Search,
  Target,
  TrendingUp,
  Trophy,
  UserRoundPen,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";

const { width, height } = Dimensions.get("window");

// --- Mock Data ---
const MOCK_EXTRAS = {
  rank: "钻石 III",
  elo: 2150,
  winRate: "77.8%",
  streak: 5,
  avatar:
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop",
  nextMatch: {
    time: "今天 19:30",
    location: "源深体育馆 - 4号场",
    opponent: "王小羽 (排名 #12)",
    type: "排位赛",
  },
};

const RECENT_FEED = [
  {
    id: 1,
    user: "张大雷",
    action: "晋升至",
    target: "白金 I",
    time: "15分钟前",
    avatar: "https://i.pravatar.cc/150?u=a",
  },
  {
    id: 2,
    user: "浦东羽林军",
    action: "发布了新活动",
    target: "周六团练",
    time: "1小时前",
    avatar: "🛡️",
  },
];

const TRAINING_VIDEOS = [
  {
    id: "1",
    title: "Mastering the Backhand Clear",
    duration: "12:45",
  },
  {
    id: "2",
    title: "Footwork Drills for Beginners",
    duration: "08:30",
  },
];

function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const [profileData, statsData] = await Promise.all([
          getPlayerProfile(session.user.id),
          getPlayerStats(session.user.id),
        ]);
        setProfile(profileData);
        setStats(statsData);
      }
    };
    fetchData();
  }, [session]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Background Glow Decorations */}
        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        {/* Top Navigation Bar */}
        <View style={styles.navbar}>
          <TouchableOpacity style={styles.navSearch}>
            <Search size={20} color="#64748b" />
            <Text style={styles.navSearchPlaceholder}>搜索球友、赛事...</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navIcon}>
            <Bell size={22} color="#f8fafc" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Profile Info Section */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarGlow} />
              <TouchableOpacity
                style={styles.avatarContainer}
                onPress={() =>
                  router.push("/screen/profile/profile_Information")
                }
              >
                <Image
                  source={{ uri: profile?.avatar_url || MOCK_EXTRAS.avatar }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.welcomeText}>欢迎回来</Text>
              <View style={styles.nameRow}>
                <Text style={styles.nickname}>
                  {profile?.nickname || "林丹接班人"}
                </Text>
                <CountryFlag isoCode="MY" size={16} style={styles.flag} />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.streakIcon}>
            <TouchableOpacity
              onPress={() => router.push("/screen/profile/setting")}
            >
              <UserRoundPen size={22} color="#f8fafc" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Rank & ELO Card */}
        <View style={styles.rankCardContainer}>
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.2)", "rgba(20, 184, 166, 0.2)"]}
            style={styles.rankCardBlur}
          />
          <View style={styles.rankCard}>
            <View style={styles.rankHeader}>
              <View>
                <View style={styles.rankBadgeLabel}>
                  <Award size={16} color="#10b981" />
                  <Text style={styles.rankLabelText}>当前段位</Text>
                </View>
                <Text style={styles.rankTitle}>
                  {stats?.rank?.rank_name || MOCK_EXTRAS.rank}
                </Text>
              </View>
              <View style={styles.eloContainer}>
                <Text style={styles.eloLabel}>ELO 积分</Text>
                <Text style={styles.eloValue}>
                  {stats?.current_elo || MOCK_EXTRAS.elo}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>晋级进度</Text>
                <Text style={styles.progressPercent}>
                  {stats
                    ? (
                        ((stats.current_elo - (stats.rank?.min_elo || 0)) /
                          ((stats.rank?.max_elo || 1000) -
                            (stats.rank?.min_elo || 0))) *
                        100
                      ).toFixed(0)
                    : "80"}
                  %
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={["#10b981", "#2dd4bf"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    {
                      width: stats
                        ? `${
                            ((stats.current_elo - (stats.rank?.min_elo || 0)) /
                              ((stats.rank?.max_elo || 1000) -
                                (stats.rank?.min_elo || 0))) *
                            100
                          }%`
                        : "80%",
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressNote}>
                {stats?.rank
                  ? `距离晋升下一等级还需 ${
                      (stats.rank.max_elo || 0) - stats.current_elo
                    } 分`
                  : "距离晋升还需 50 分"}
              </Text>
            </View>
          </View>
        </View>

        {/* Key Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Activity size={18} color="#60a5fa" />
            <Text style={styles.statLabel}>胜率</Text>
            <Text style={styles.statValue}>
              {stats
                ? (
                    (stats.season_wins /
                      (stats.season_wins + stats.season_losses || 1)) *
                    100
                  ).toFixed(1) + "%"
                : MOCK_EXTRAS.winRate}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Flame size={18} color="#f97316" />
            <Text style={styles.statLabel}>等级</Text>
            <Text style={styles.statValue}>
              {stats?.rank?.rank_name?.split(" ")[0] || "钻石"}
            </Text>
          </View>
          <View style={styles.statBox}>
            <TrendingUp size={18} color="#a78bfa" />
            <Text style={styles.statLabel}>积分排名</Text>
            <Text style={styles.statValue}>#{stats ? "24" : "42"}</Text>
          </View>
        </View>

        {/* Mini Applications Section */}
        <View style={styles.miniAppWrapper}>
          <MiniApp />
        </View>

        {/* Next Match Card */}
        <View style={styles.sectionHeader}>
          <Calendar size={14} color="#10b981" />
          <Text style={styles.sectionTitle}>NEXT CHALLENGE</Text>
        </View>
        <TouchableOpacity
          style={styles.nextMatchCard}
          onPress={() => router.push("/(tabs)/match")}
          activeOpacity={0.9}
        >
          <View style={styles.matchTrophyBg}>
            <Trophy size={140} color="rgba(0,0,0,0.05)" />
          </View>
          <View style={styles.matchContent}>
            <View style={styles.matchTimeBadge}>
              <Clock size={12} color="#0f172a" />
              <Text style={styles.matchTimeText}>
                {MOCK_EXTRAS.nextMatch.time}
              </Text>
            </View>
            <Text style={styles.opponentName}>
              {MOCK_EXTRAS.nextMatch.opponent}
            </Text>
            <View style={styles.locationContainer}>
              <Target size={12} color="rgba(15, 23, 42, 0.7)" />
              <Text style={styles.locationText}>
                {MOCK_EXTRAS.nextMatch.location}
              </Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <ChevronRight size={24} color="#0f172a" strokeWidth={3} />
          </View>
        </TouchableOpacity>

        {/* Training Materials Section */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Trophy size={14} color="#3b82f6" />
          <Text style={styles.sectionTitle}>TRAINING MATERIALS</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.videoScroll}
        >
          {TRAINING_VIDEOS.map((video) => (
            <TouchableOpacity key={video.id} style={styles.videoCard}>
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{
                    uri: `https://picsum.photos/seed/video${video.id}/400/225`,
                  }}
                  style={styles.thumbnail}
                />
                <View style={styles.playOverlay}>
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={40}
                    color="rgba(255,255,255,0.8)"
                  />
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{video.duration}</Text>
                </View>
              </View>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {video.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Activity Feed */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <TrendingUp size={14} color="#f97316" />
          <Text style={styles.sectionTitle}>ACTIVITY FEED</Text>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.feedList}>
          {RECENT_FEED.map((item) => (
            <View key={item.id} style={styles.feedItem}>
              <View style={styles.feedContent}>
                <View style={styles.feedAvatar}>
                  {item.avatar.startsWith("http") ? (
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.feedAvatarImage}
                    />
                  ) : (
                    <Text style={styles.feedAvatarEmoji}>{item.avatar}</Text>
                  )}
                </View>
                <View style={styles.feedTextContainer}>
                  <Text style={styles.feedText}>
                    <Text style={styles.feedUserName}>{item.user}</Text>{" "}
                    {item.action}
                    <Text style={styles.feedTarget}> {item.target}</Text>
                  </Text>
                  <Text style={styles.feedTime}>{item.time}</Text>
                </View>
              </View>
              <View style={styles.feedActions}>
                <TouchableOpacity>
                  <Heart size={16} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MessageSquare size={16} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    top: -height * 0.05,
    right: -width * 0.1,
    width: width * 0.6,
    height: height * 0.2,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 80,
    transform: [{ scaleX: 2 }],
  },
  bottomGlow: {
    position: "absolute",
    bottom: height * 0.2,
    left: -width * 0.1,
    width: width * 0.5,
    height: height * 0.3,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: 80,
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  navSearch: {
    flex: 1,
    height: 44,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  navSearchPlaceholder: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "500",
  },
  navIcon: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 13,
    right: 13,
    width: 8,
    height: 8,
    backgroundColor: "#ef4444",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#050505",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#10b981",
    borderRadius: 12,
    opacity: 0.2,
    transform: [{ scale: 1.1 }],
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.3)",
    overflow: "hidden",
    backgroundColor: "#1e293b",
    zIndex: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  welcomeText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flag: {
    borderRadius: 2,
  },
  streakIcon: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  rankCardContainer: {
    marginBottom: 32,
    position: "relative",
  },
  rankCardBlur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    opacity: 0.5,
  },
  rankCard: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  rankHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rankBadgeLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  rankLabelText: {
    fontSize: 10,
    color: "#94ae9e",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: -0.5,
  },
  rankTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#f8fafc",
    fontStyle: "italic",
  },
  eloContainer: {
    alignItems: "flex-end",
  },
  eloLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  eloValue: {
    fontSize: 28,
    fontWeight: "900",
    color: "#10b981",
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  progressPercent: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "bold",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  progressNote: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "900",
    color: "#f8fafc",
  },
  miniAppWrapper: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: 2.2,
    textTransform: "uppercase",
  },
  nextMatchCard: {
    backgroundColor: "#10b981",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  matchTrophyBg: {
    position: "absolute",
    right: -20,
    bottom: -30,
    transform: [{ rotate: "12deg" }],
  },
  matchContent: {
    flex: 1,
    zIndex: 1,
  },
  matchTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(15, 23, 42, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  matchTimeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#0f172a",
    textTransform: "uppercase",
  },
  opponentName: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "rgba(15, 23, 42, 0.7)",
  },
  chevronContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 14,
    borderRadius: 18,
    zIndex: 1,
  },
  seeAllButton: {
    marginLeft: "auto",
  },
  seeAllText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  videoScroll: {
    marginBottom: 20,
  },
  videoCard: {
    width: 240,
    marginRight: 15,
  },
  thumbnailContainer: {
    width: "100%",
    height: 135,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1e293b",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
    marginTop: 8,
    lineHeight: 20,
  },
  feedList: {
    gap: 16,
  },
  feedItem: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feedContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  feedAvatar: {
    width: 48,
    height: 48,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  feedAvatarImage: {
    width: "100%",
    height: "100%",
  },
  feedAvatarEmoji: {
    fontSize: 24,
  },
  feedTextContainer: {
    maxWidth: width * 0.5,
  },
  feedText: {
    fontSize: 12,
    color: "#cbd5e1",
    lineHeight: 18,
  },
  feedUserName: {
    fontWeight: "bold",
    color: "#f8fafc",
    fontSize: 14,
  },
  feedTarget: {
    color: "#10b981",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  feedTime: {
    fontSize: 10,
    color: "#475569",
    marginTop: 4,
    fontWeight: "500",
  },
  feedActions: {
    flexDirection: "row",
    gap: 16,
    paddingRight: 8,
  },
});

export default HomeScreen;
