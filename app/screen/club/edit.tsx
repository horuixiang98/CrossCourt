import { useSession } from "@/src/providers/SessionProvider";
import {
  ClubProfile,
  getClubById,
  updateClub,
  uploadClubAvatar,
  uploadClubCover,
} from "@/src/services/clubService";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Camera, ChevronLeft, Save } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditClubScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { session } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [club, setClub] = useState<ClubProfile | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [contactWa, setContactWa] = useState("");

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadClubDetails();
    }
  }, [id]);

  const loadClubDetails = async () => {
    try {
      setLoading(true);
      const data = await getClubById(id as string, session?.user?.id);
      if (data) {
        setClub(data);
        setName(data.name);
        setTag(data.tag);
        setLocation(data.location);
        setBio(data.bio);
        setAnnouncement(data.announcement);
        setContactWa(data.contact_wa || "");
        setAvatarUri(data.logo);
        setCoverUri(data.cover);
      }
    } catch (error) {
      console.error("Error loading club details:", error);
      Alert.alert("Error", "Failed to load club details");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (type: "avatar" | "cover") => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "avatar" ? [1, 1] : [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        // Compress and Resize
        const manipResult = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: type === "avatar" ? 512 : 1024 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );

        if (type === "avatar") {
          setAvatarUri(manipResult.uri);
        } else {
          setCoverUri(manipResult.uri);
        }
      }
    } catch (error) {
      console.error("Error picking/compressing image:", error);
      Alert.alert("Error", "Failed to process image");
    }
  };

  const handleSave = async () => {
    if (!club) return;
    setSaving(true);
    try {
      // 1. Upload new Avatar if changed
      if (
        avatarUri &&
        avatarUri !== club.logo &&
        !avatarUri.startsWith("http")
      ) {
        const { error } = await uploadClubAvatar(club.id, avatarUri);
        if (error) throw error;
      }

      // 2. Upload new Cover if changed
      if (coverUri && coverUri !== club.cover && !coverUri.startsWith("http")) {
        const { error } = await uploadClubCover(club.id, coverUri);
        if (error) throw error;
      }

      // 3. Update Text Fields
      const { success, error } = await updateClub(club.id, {
        name,
        tag,
        location,
        bio,
        announcement,
        contact_wa: contactWa,
      });

      if (!success || error) throw error;

      Alert.alert("Success", "Club details updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error updating club:", error);
      Alert.alert("Error", "Failed to update club details");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" />

      {/* Full Screen Scroll */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Actions (Floating) */}
          <View style={styles.floatingHeader}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.blurButton}
            >
              <ChevronLeft size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={[
                styles.blurButton,
                styles.saveButton,
                saving && { opacity: 0.7 },
              ]}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Save size={18} color="#fff" />
                  <Text style={styles.saveText}>Save</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Cover Section */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.coverContainer}
            onPress={() => pickImage("cover")}
          >
            <Image
              source={{
                uri:
                  coverUri ||
                  "https://images.unsplash.com/photo-1521412644187-c49fa356ee68?w=800&q=80",
              }}
              style={styles.coverImage}
            />
            <View style={styles.coverOverlay}>
              <View style={styles.changeCoverBtn}>
                <Camera size={14} color="#fff" />
                <Text style={styles.changeCoverText}>更换封面</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Main Content Card (Overlapping Cover) */}
          <View style={styles.contentCard}>
            {/* Avatar Row */}
            <View style={styles.avatarRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.avatarWrapper}
                onPress={() => pickImage("avatar")}
              >
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={{ fontSize: 32 }}>🏸</Text>
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Camera size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.avatarHint}>
                <Text style={styles.hintTitle}>俱乐部头像</Text>
                <Text style={styles.hintSub}>点击修改，推荐方形图片</Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>基本信息</Text>

              <InputField
                label="俱乐部名称"
                value={name}
                onChangeText={setName}
                placeholder="给你的俱乐部起个响亮的名字"
                icon={<Text style={{ fontSize: 16 }}>🏷️</Text>}
              />

              {/* <InputField
                label="标签 (Tag)"
                value={tag}
                onChangeText={setTag}
                placeholder="例如: AURORA"
                maxLength={10}
              /> */}

              {/* <InputField
                label="位置"
                value={location}
                onChangeText={setLocation}
                placeholder="例如: 上海 · 静安区"
              /> */}

              <InputField
                label="WhatsApp 群组/联系"
                value={contactWa}
                onChangeText={setContactWa}
                placeholder="https://chat.whatsapp.com/..."
                icon={<Text style={{ fontSize: 16 }}>🔗</Text>}
              />

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>详细介绍</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>简介</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="简单介绍一下俱乐部，吸引更多成员加入..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>最新公告</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={announcement}
                  onChangeText={setAnnouncement}
                  placeholder="发布近期的活动或重要通知..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  icon,
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputWrapper}>
      {icon && <View style={styles.inputIcon}>{icon}</View>}
      <TextInput
        style={[styles.input, icon && { paddingLeft: 44 }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#64748b"
        maxLength={maxLength}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  floatingHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 50,
  },
  blurButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  saveButton: {
    width: "auto",
    paddingHorizontal: 16,
    backgroundColor: "#10b981", // Emerald accent
    borderColor: "transparent",
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  coverContainer: {
    width: "100%",
    height: 280,
    backgroundColor: "#1e293b",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  changeCoverBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  changeCoverText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  contentCard: {
    marginTop: -40,
    backgroundColor: "#0f0f0f",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 0,
    minHeight: 500,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: -50,
    marginBottom: 24,
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#0f0f0f",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 36,
    backgroundColor: "#334155",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#0f0f0f",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: -4,
    backgroundColor: "#10b981",
    padding: 6,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: "#0f0f0f",
  },
  avatarHint: {
    marginBottom: 8,
  },
  hintTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  hintSub: {
    color: "#94a3b8",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  label: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  textArea: {
    minHeight: 120,
    lineHeight: 24,
    paddingTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
});
