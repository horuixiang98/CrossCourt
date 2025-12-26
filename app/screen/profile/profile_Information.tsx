import { Colors } from "@/constants/theme";
import { useSession } from "@/src/providers/SessionProvider";
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
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
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
        <View style={{ width: 40 }} /> {/* Spacer for centering */}
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.formContainer}>
          {/* Email Input (Disabled) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
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

          {/* Username Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color={Colors.light.icon}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={username || ""}
                onChangeText={(text) => setUsername(text)}
                placeholder="username"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Website Input */}
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
                value={website || ""}
                onChangeText={(text) => setWebsite(text)}
                placeholder="website.com"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                loading && styles.buttonDisabled,
              ]}
              onPress={() =>
                updateProfile({ username, website, avatar_url: avatarUrl })
              }
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => supabase.auth.signOut()}
            >
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
  formContainer: {
    gap: 20,
    marginTop: 10,
  },
  inputGroup: {
    gap: 8,
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
    backgroundColor: Colors.light.lightgray || "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    borderColor: "#d0d0d0",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    height: 50,
    borderRadius: 12,
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
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#ff4444", // Red for sign out
  },
  secondaryButtonText: {
    color: "#ff4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
