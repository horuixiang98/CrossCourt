import { Colors } from "@/constants/theme";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { Session } from "@supabase/supabase-js";
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

export default function Account({ session }: { session: Session | null }) {
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
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Text style={styles.headerSubtitle}>Update your information</Text>
      </View>

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
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    backgroundColor: Colors.light.background,
  },
  headerContainer: {
    marginBottom: 32,
    alignItems: "center",
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.light.icon,
  },
  formContainer: {
    gap: 20,
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
