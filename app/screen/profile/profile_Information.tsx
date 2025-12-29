import { Colors } from "@/constants/theme";
import { useSession } from "@/src/providers/SessionProvider";
import {
  getPlayerProfile,
  updatePlayerProfile,
} from "@/src/services/playerProfileService";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        setUsername(data.username || "");
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
        username,
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
      <View style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Information</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            {avatarUrl ? (
              <TextInput value={avatarUrl} style={{ display: "none" }} /> // Placeholder for future image logic
            ) : (
              <Ionicons name="person" size={50} color={Colors.light.icon} />
            )}
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>Change Profile Photo</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionHeader}>PERSONAL INFO</Text>

          {/* Email (Read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: Colors.light.icon }]}
                value={session?.user?.email}
                editable={false}
              />
            </View>
          </View>

          {/* Nickname (Full Name) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={nickname}
                onChangeText={setNickname}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="at-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Website */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Website</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="globe-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="yourwebsite.com"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Bio */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio</Text>
            <View
              style={[
                styles.inputWrapper,
                { height: 100, alignItems: "flex-start", paddingTop: 12 },
              ]}
            >
              <Ionicons
                name="book-outline"
                size={20}
                color={Colors.light.icon}
                style={[styles.inputIcon, { marginTop: 2 }]}
              />
              <TextInput
                style={[styles.input, { height: "100%" }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={[styles.sectionHeader, { marginTop: 20 }]}>
            <Text style={styles.sectionHeaderText}>GAME INFO</Text>
          </View>

          {/* Favorite Racket */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Favorite Racket</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="fitness-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={favoriteRacket}
                onChangeText={setFavoriteRacket}
                placeholder="e.g. Yonex Astrox 88D"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Play Years */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Years of Play</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={playYears}
                onChangeText={setPlayYears}
                placeholder="e.g. 5"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Handedness */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Handedness</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="hand-right-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={handedness}
                onChangeText={setHandedness}
                placeholder="Right / Left"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                updating && styles.buttonDisabled,
              ]}
              onPress={handleUpdateProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.primaryButtonText}>Update Profile</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => supabase.auth.signOut()}
            >
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#ff4444"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.secondaryButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
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
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  container: {
    padding: 24,
    flexGrow: 1,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.light.lightgray || "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: Colors.light.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarText: {
    marginTop: 12,
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  formContainer: {
    gap: 16,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.light.icon,
    letterSpacing: 1,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.lightgray2 || "#f8f8f8",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: "#eef0ee",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#d0d0d0",
    opacity: 0.8,
  },
  inputIcon: {
    marginRight: 10,
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 32,
    marginBottom: 20,
  },
  button: {
    height: 54,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#ff4444",
  },
  secondaryButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "bold",
  },
});
