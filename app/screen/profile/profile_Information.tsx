import { useSession } from "@/src/providers/SessionProvider";
import {
  getPlayerProfile,
  updatePlayerProfile,
} from "@/src/services/playerProfileService";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Globe,
  Hand,
  LogOut,
  Mail,
  User,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ProfileInformation() {
  const { session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form states
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [favoriteRacket, setFavoriteRacket] = useState("");
  const [playYears, setPlayYears] = useState("");
  const [handedness, setHandedness] = useState("");

  useEffect(() => {
    if (session?.user?.id) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) throw new Error("No user on the session!");

      const data = await getPlayerProfile(session.user.id);

      if (data) {
        // setUsername(data.username || ""); // Column doesn't exist
        setNickname(data.nickname || "");
        setWebsite(data.website || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
        setFavoriteRacket(data.favorite_racket || "");
        setPlayYears(data.play_years?.toString() || "");
        setHandedness(data.handedness || "");
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);
      if (!session?.user?.id) throw new Error("No user on the session!");

      const { success, error } = await updatePlayerProfile(session.user.id, {
        // username, // Column doesn't exist
        nickname,
        website,
        bio,
        avatar_url: avatarUrl,
        favorite_racket: favoriteRacket,
        play_years: playYears ? parseInt(playYears) : null,
        handedness,
      });

      if (!success) {
        throw error || new Error("Failed to update profile");
      }

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.centered]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.mainContainer} edges={["top"]}>
      {/* Glow Decorations */}
      <View style={styles.topGlow} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#f8fafc" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>个人信息</Text>
        <TouchableOpacity
          style={styles.saveHeaderButton}
          onPress={handleUpdateProfile}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#10b981" />
          ) : (
            <Text style={styles.saveHeaderText}>保存</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarCircle}>
              <User size={40} color="#64748b" />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.avatarText}>更换头像</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>基本资料</Text>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>邮箱地址</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Mail size={18} color="#475569" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: "#475569" }]}
                value={session?.user?.email}
                editable={false}
              />
            </View>
          </View>

          {/* Nickname */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>昵称</Text>
            <View style={styles.inputWrapper}>
              <User size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="请输入昵称"
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          {/* Username - Disabled as column doesn't exist in DB */}
          {/* 
          <View style={styles.inputGroup}>
            <Text style={styles.label}>用户名</Text>
            <View style={styles.inputWrapper}>
              <Text
                style={[
                  styles.inputIcon,
                  { color: "#64748b", fontWeight: "bold" },
                ]}
              >
                @
              </Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="唯一用户名"
                autoCapitalize="none"
                placeholderTextColor="#475569"
              />
            </View>
          </View>
          */}

          {/* Website */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>个人网站</Text>
            <View style={styles.inputWrapper}>
              <Globe size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="yourwebsite.com"
                autoCapitalize="none"
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>个性签名</Text>
            <View
              style={[
                styles.inputWrapper,
                { height: 100, alignItems: "flex-start", paddingTop: 14 },
              ]}
            >
              <TextInput
                style={[styles.input, { height: "100%" }]}
                value={bio}
                onChangeText={setBio}
                placeholder="向大家介绍一下你自己..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
            进阶竞技信息
          </Text>

          {/* Favorite Racket */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>常用球拍</Text>
            <View style={styles.inputWrapper}>
              <Hand size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={favoriteRacket}
                onChangeText={setFavoriteRacket}
                placeholder="例: Yonex Astrox 88D"
                placeholderTextColor="#475569"
              />
            </View>
          </View>

          <View style={styles.row}>
            {/* Play Years */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>球龄 (年)</Text>
              <View style={styles.inputWrapper}>
                <Calendar size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={playYears}
                  onChangeText={setPlayYears}
                  placeholder="2"
                  keyboardType="numeric"
                  placeholderTextColor="#475569"
                />
              </View>
            </View>

            {/* Handedness */}
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>持拍手</Text>
              <View style={styles.inputWrapper}>
                <Hand size={18} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={handedness}
                  onChangeText={setHandedness}
                  placeholder="右手 / 左手"
                  placeholderTextColor="#475569"
                />
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.signOutButton]}
              onPress={() => supabase.auth.signOut()}
            >
              <LogOut size={20} color="#ef4444" style={{ marginRight: 8 }} />
              <Text style={styles.signOutButtonText}>注销登录</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 0.8,
    height: height * 0.2,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: 0.5,
  },
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  saveHeaderText: {
    color: "#10b981",
    fontWeight: "bold",
    fontSize: 16,
  },
  container: {
    padding: 24,
    paddingBottom: 60,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#10b981",
    borderRadius: 40,
    opacity: 0.1,
    transform: [{ scale: 1.2 }],
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.3)",
    position: "relative",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: -6,
    right: -6,
    backgroundColor: "#10b981",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#050505",
  },
  avatarText: {
    marginTop: 16,
    fontSize: 12,
    color: "#10b981",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  formContainer: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#94a3b8",
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#f8fafc",
    fontWeight: "500",
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  signOutButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  signOutButtonText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "bold",
  },
});
