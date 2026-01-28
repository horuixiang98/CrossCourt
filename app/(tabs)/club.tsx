import { useSession } from "@/src/providers/SessionProvider";
import { ClubProfile, getJoinedClubProfile } from "@/src/services/clubService";
import { useRouter } from "expo-router";
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  MapPin,
  Plus,
  Search,
  Trophy,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const MY_CLUBS = [
  {
    id: "c1",
    name: "浦东羽林军",
    role: "会长",
    logo: "🛡️",
    activeAct: 2,
    newAnnounce: true,
    memberCount: 86,
    rank: "No.5",
  },
  {
    id: "c2",
    name: "阿里体育社",
    role: "成员",
    logo: "🏢",
    activeAct: 1,
    newAnnounce: false,
    memberCount: 120,
    rank: "No.12",
  },
  {
    id: "c3",
    name: "周末晨练团",
    role: "管理员",
    logo: "☀️",
    activeAct: 0,
    newAnnounce: false,
    memberCount: 24,
    rank: "No.45",
  },
];

const RECOMMENDED_CLUBS = [
  {
    id: "r1",
    name: "静安暴力扣杀团",
    distance: "1.2km",
    tags: ["中高级", "双打为主"],
    logo: "🔥",
  },
  {
    id: "r2",
    name: "徐汇养生羽球",
    distance: "3.5km",
    tags: ["新手友好", "周五晚"],
    logo: "🏸",
  },
];

export default function ClubScreen() {
  const { session } = useSession();
  const router = useRouter();
  const [clubs, setClubs] = useState<ClubProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getClubProfile = async () => {
    try {
      setLoading(true);
      const data = await getJoinedClubProfile(session?.user?.id || "");
      setClubs(data);
    } catch (error) {
      console.error("Failed to fetch clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getClubProfile();
    setRefreshing(false);
  };

  useEffect(() => {
    getClubProfile();
  }, [session?.user?.id]);

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981" // Match theme color
            colors={["#10b981"]} // For Android
            progressViewOffset={100}
          />
        }
      >
        {/* Glow Decorations */}
        <View style={styles.topGlow} />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>公会中心</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Search size={20} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.plusButton]}
              onPress={() => router.push("/screen/club/create")}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContainer}
        >
          <TouchableOpacity style={[styles.filterTag, styles.filterTagActive]}>
            <Text style={styles.filterTagTextActive}>我的全部</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTag}>
            <Text style={styles.filterTagText}>附近约球</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterTag}>
            <Text style={styles.filterTagText}>热门公会</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Joined Clubs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>
            已加入的公会 ({clubs.length})
          </Text>

          {loading ? (
            <ClubSkeleton />
          ) : clubs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                还没加入任何公会，去发现页看看吧
              </Text>
            </View>
          ) : (
            clubs.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.clubCard}
                onPress={() =>
                  router.push({
                    pathname: "/screen/club/details",
                    params: { id: club.id },
                  })
                }
              >
                {/* Background Accent */}
                <View style={styles.cardAccent} />

                <View style={styles.clubCardContent}>
                  <View style={styles.clubInfoRow}>
                    <View style={styles.logoContainer}>
                      {club.logo ? (
                        <Image
                          source={{ uri: club.logo }}
                          style={styles.logoImage}
                        />
                      ) : (
                        <Text style={styles.logoText}>🏸</Text>
                      )}
                    </View>
                    <View style={styles.clubDetails}>
                      <View style={styles.nameRow}>
                        <Text style={styles.clubName} numberOfLines={1}>
                          {club.name}
                        </Text>
                        {/* Logic for new announcement could be added later */}
                      </View>
                      <View style={styles.statsRow}>
                        <View style={styles.roleBadge}>
                          <Text style={styles.roleText}>
                            {club.role || "成员"}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Users size={10} color="#64748b" />
                          <Text style={styles.statText}>
                            {club.memberCount}
                          </Text>
                        </View>
                        <View style={styles.statItem}>
                          <Trophy size={10} color="#64748b" />
                          <Text style={styles.statText}>No.{club.rank}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.rightCol}>
                    {club.activeAct > 0 ? (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeText}>
                          {club.activeAct} 活动中
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.inactiveBadge}>
                        <Text style={styles.inactiveText}>暂无活动</Text>
                      </View>
                    )}
                    <ChevronRight size={16} color="#1e293b" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Discovery Section */}
        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeader}>
            <View style={styles.discoveryTitleRow}>
              <Compass size={14} color="#64748b" />
              <Text style={styles.discoveryTitle}>发现新公会</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.mapButtonText}>查看地图</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.discoveryScroll}
          >
            {RECOMMENDED_CLUBS.map((club) => (
              <TouchableOpacity
                key={club.id}
                style={styles.recommendCard}
                onPress={() => router.push("/screen/club/details")}
              >
                <Text style={styles.recommendLogo}>{club.logo}</Text>
                <Text style={styles.recommendName}>{club.name}</Text>
                <View style={styles.distanceRow}>
                  <MapPin size={10} color="#64748b" />
                  <Text style={styles.distanceText}>距离 {club.distance}</Text>
                </View>
                <View style={styles.tagRow}>
                  {club.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>申请加入</Text>
                  <ArrowUpRight size={10} color="#f8fafc" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    left: -width * 0.2,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  plusButton: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  filterScroll: {
    marginBottom: 24,
  },
  filterContainer: {
    gap: 12,
    paddingBottom: 4,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  filterTagActive: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  filterTagText: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "600",
  },
  filterTagTextActive: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  clubCard: {
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    marginBottom: 12,
    overflow: "hidden",
    position: "relative",
  },
  cardAccent: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 35,
  },
  clubCardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clubInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  logoContainer: {
    width: 56,
    height: 56,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  logoText: {
    fontSize: 24,
  },
  clubDetails: {
    gap: 4,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  clubName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  announceDot: {
    width: 6,
    height: 6,
    backgroundColor: "#ef4444",
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roleBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: 8,
  },
  activeBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "900",
    fontStyle: "italic",
  },
  inactiveBadge: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inactiveText: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "bold",
  },
  discoverySection: {
    marginTop: 8,
  },
  discoveryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  discoveryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discoveryTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  mapButtonText: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "bold",
  },
  discoveryScroll: {
    gap: 16,
    paddingBottom: 20,
  },
  recommendCard: {
    width: 200,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    padding: 20,
  },
  recommendLogo: {
    fontSize: 32,
    marginBottom: 12,
  },
  recommendName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 4,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 10,
    color: "#64748b",
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 8,
    color: "#94a3b8",
  },
  joinButton: {
    width: "100%",
    height: 40,
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  joinButtonText: {
    fontSize: 10,
    color: "#f8fafc",
    fontWeight: "bold",
  },
  loadingContainer: {
    gap: 1,
  },
  loadingText: {
    color: "#64748b",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.2)",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  emptyText: {
    color: "#64748b",
    fontSize: 12,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  // Skeleton Styles
  skeletonCard: {
    height: 100,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
    marginBottom: 12,
    overflow: "hidden",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  skeletonLogo: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  skeletonContent: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
});

const ClubSkeleton = () => {
  return (
    <View style={styles.loadingContainer}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.skeletonCard}>
          <View style={styles.skeletonLogo} />
          <View style={styles.skeletonContent}>
            <View
              style={[styles.skeletonLine, { width: "60%", marginBottom: 4 }]}
            />
            <View style={[styles.skeletonLine, { width: "40%" }]} />
          </View>
        </View>
      ))}
    </View>
  );
};
