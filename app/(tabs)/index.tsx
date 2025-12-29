import { Colors } from "@/constants/theme";
import MiniApp from "@/src/components/indexPage/miniApp";
import Search from "@/src/components/indexPage/search";
import { useSession } from "@/src/providers/SessionProvider";
import { getPlayerProfile } from "@/src/services/playerProfileService";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CountryFlag from "react-native-country-flag";

function HomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const { session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.id) {
        const data = await getPlayerProfile(session.user.id);
        setProfile(data);
      }
    };
    fetchProfile();
  }, [session]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const trainingVideos = [
    {
      id: "1",
      title: "Mastering the Backhand Clear",
      thumbnail: "https://img.youtube.com/vi/1_z_v1_z_v1/0.jpg", // Placeholder
      duration: "12:45",
    },
    {
      id: "2",
      title: "Footwork Drills for Beginners",
      thumbnail: "https://img.youtube.com/vi/2_z_v2_z_v2/0.jpg", // Placeholder
      duration: "08:30",
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header with Search and Notifications */}
      <View style={styles.topHeader}>
        <View style={{ flex: 1 }}>
          <Search />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Feather name="bell" size={22} color="#1c1c1c" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Profile Header */}
      <View style={styles.ProfileHeader}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greetingText}>{getGreeting()},</Text>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{profile?.nickname}</Text>
              <CountryFlag isoCode="MY" size={18} style={styles.flag} />
            </View>
            <View style={styles.rankBadge}>
              <MaterialCommunityIcons
                name="trophy-outline"
                size={12}
                color="#1c1c1c90"
              />
              <Text style={styles.rankText}>Ranked No. 32 in KL</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
            <Image
              style={styles.ProfileImage}
              source={{ uri: "https://picsum.photos/seed/696/3000/2000" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Community Welcome Banner */}
      <View style={styles.communityBanner}>
        <View style={styles.bannerIconContainer}>
          <Text style={styles.bannerIcon}>🏸</Text>
        </View>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>
            这里，是马来西亚业余羽毛球爱好者的家
          </Text>
          <Text style={styles.bannerSubtitle}>
            我们相信，羽毛球不只是运动，更是人与人之间的连接。
          </Text>
          <Text style={styles.bannerSubtitle}>
            从一场球开始，认识更多志同道合的球友。
          </Text>
        </View>
      </View>

      {/* Training Videos Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Training Materials</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => router.push("/(tabs)/training")}
        >
          <Text style={styles.moreText}>See More</Text>
          <Feather
            name="chevron-right"
            size={16}
            color={Colors.light.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.videoScroll}
      >
        {trainingVideos.map((video) => (
          <TouchableOpacity key={video.id} style={styles.videoCard}>
            <View style={styles.thumbnailContainer}>
              <Image
                source={{
                  uri: `https://picsum.photos/seed/${video.id}/400/225`,
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

      <MiniApp />
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.light.lightgray,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff4b4b",
    borderWidth: 1.5,
    borderColor: Colors.light.lightgray,
  },
  ProfileHeader: {
    padding: 15,
    borderRadius: 16,
    backgroundColor: Colors.light.lightgray,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 14,
    color: "#1c1c1c90",
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1c1c1c",
  },
  flag: {
    marginLeft: 8,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary + "15", // 15% opacity green
    paddingHorizontal: 0,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  rankText: {
    fontSize: 11,
    color: "#1c1c1c90",
    marginLeft: 4,
    fontWeight: "700",
  },
  ProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  communityBanner: {
    padding: 20,
    backgroundColor: Colors.light.primary,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  bannerIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  bannerIcon: {
    fontSize: 24,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1c1c1c",
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "700",
    marginRight: 2,
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
    backgroundColor: "#f0f0f0",
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
    color: "#1c1c1c",
    marginTop: 8,
    lineHeight: 20,
  },
});
