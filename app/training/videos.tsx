import { Colors } from "@/constants/theme";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const VIDEO_CATEGORIES = [
  {
    id: "recommended",
    title: "Recommended for You",
    videos: [
      {
        id: "v1",
        title: "Lee Zii Jia's Signature Backhand Smash Tutorial",
        channel: "Pro Badminton Academy",
        views: "1.2M views",
        time: "2 days ago",
        duration: "15:20",
        thumbnail: "https://picsum.photos/seed/v1/800/450",
      },
      {
        id: "v2",
        title: "How to Improve Your Footwork in 10 Minutes",
        channel: "Badminton Insight",
        views: "850K views",
        time: "1 week ago",
        duration: "10:05",
        thumbnail: "https://picsum.photos/seed/v2/800/450",
      },
    ],
  },
  {
    id: "beginner",
    title: "Beginner Essentials",
    videos: [
      {
        id: "v3",
        title: "Basic Grips: Forehand vs Backhand",
        channel: "Coach Ryan",
        views: "200K views",
        time: "1 month ago",
        duration: "08:45",
        thumbnail: "https://picsum.photos/seed/v3/800/450",
      },
      {
        id: "v4",
        title: "The 4 Basic Badminton Serves",
        channel: "Badminton 101",
        views: "150K views",
        time: "3 weeks ago",
        duration: "12:30",
        thumbnail: "https://picsum.photos/seed/v4/800/450",
      },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Techniques",
    videos: [
      {
        id: "v5",
        title: "Mastering the Jump Smash",
        channel: "Elite Training",
        views: "500K views",
        time: "5 days ago",
        duration: "18:15",
        thumbnail: "https://picsum.photos/seed/v5/800/450",
      },
    ],
  },
];

export default function TrainingVideosScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Training Materials</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Feather name="search" size={22} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {VIDEO_CATEGORIES.map((category) => (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {category.videos.map((video) => (
              <TouchableOpacity key={video.id} style={styles.videoCard}>
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: video.thumbnail }}
                    style={styles.thumbnail}
                  />
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{video.duration}</Text>
                  </View>
                  <View style={styles.playOverlay}>
                    <MaterialCommunityIcons
                      name="play"
                      size={48}
                      color="rgba(255,255,255,0.9)"
                    />
                  </View>
                </View>

                <View style={styles.videoInfo}>
                  <View style={styles.channelAvatar}>
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarText}>{video.channel[0]}</Text>
                    </View>
                  </View>
                  <View style={styles.textInfo}>
                    <Text style={styles.videoTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.videoMeta}>
                      {video.channel} • {video.views} • {video.time}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.moreOptions}>
                    <Feather name="more-vertical" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.light.text,
  },
  searchButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  categorySection: {
    marginTop: 20,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1c1c1c",
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "700",
  },
  videoCard: {
    marginBottom: 24,
  },
  thumbnailContainer: {
    width: "100%",
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  durationBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  videoInfo: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  channelAvatar: {
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary + "20", // 20% opacity
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary + "40",
  },
  avatarText: {
    color: Colors.light.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  textInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1c1c1c",
    lineHeight: 22,
    marginBottom: 4,
  },
  videoMeta: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  moreOptions: {
    paddingLeft: 8,
  },
});
