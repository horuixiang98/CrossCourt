import { useSession } from "@/src/providers/SessionProvider";
import {
  createClub,
  uploadClubAvatar,
  uploadClubCover,
} from "@/src/services/clubService";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Stack, useRouter } from "expo-router";
import { Camera, Check, ChevronLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateClubScreen() {
  const router = useRouter();
  const { session } = useSession();

  const [creating, setCreating] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [bio, setBio] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [contactWa, setContactWa] = useState("");

  // Location State
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [coverUri, setCoverUri] = useState<string | null>(null);

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

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert("Required", "Please enter a club name");
      return;
    }

    if (!session?.user?.id) {
      Alert.alert("Error", "You must be logged in");
      return;
    }

    setCreating(true);
    try {
      // 1. Create Club Record
      const { success, clubId, error } = await createClub(session.user.id, {
        name,
        tag,
        bio,
        announcement,
        creator_id: session.user.id,
        contact_wa: contactWa,
        region,
        city,
        // Country is handled by default in service as 'Malaysia'
      });

      if (!success || !clubId || error)
        throw error || new Error("Creation failed");

      // 2. Upload Images if selected
      // We do this after creation because we need the clubId for file paths
      const uploadPromises = [];

      if (avatarUri) {
        uploadPromises.push(uploadClubAvatar(clubId, avatarUri));
      }
      if (coverUri) {
        uploadPromises.push(uploadClubCover(clubId, coverUri));
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      Alert.alert("Success", "Club created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to the new club details or back to list
            router.replace({
              pathname: "/screen/club/details",
              params: { id: clubId },
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating club:", error);
      Alert.alert("Error", "Failed to create club");
    } finally {
      setCreating(false);
    }
  };

  // Location Data
  const COUNTRIES = [{ label: "马来西亚", value: "马来西亚" }];
  const CITIES = [
    { label: "吉隆坡 (Kuala Lumpur)", value: "Kuala Lumpur" },
    { label: "雪兰莪 (Selangor)", value: "Selangor" },
    { label: "槟城 (Penang)", value: "Penang" },
    { label: "柔佛 (Johor)", value: "Johor" },
  ];

  const REGIONS: Record<string, { label: string; value: string }[]> = {
    "Kuala Lumpur": [
      { label: "Bukit Jalil", value: "Bukit Jalil" },
      { label: "Sri Petaling", value: "Sri Petaling" },
      { label: "Mont Kiara", value: "Mont Kiara" },
      { label: "Kepong", value: "Kepong" },
      { label: "Cheras", value: "Cheras" },
      { label: "Setapak", value: "Setapak" },
      { label: "Bangsar", value: "Bangsar" },
    ],
    Selangor: [
      { label: "Petaling Jaya", value: "Petaling Jaya" },
      { label: "Subang Jaya", value: "Subang Jaya" },
      { label: "Puchong", value: "Puchong" },
      { label: "Shah Alam", value: "Shah Alam" },
      { label: "Klang", value: "Klang" },
      { label: "Kota Damansara", value: "Kota Damansara" },
    ],
    // Add generic or empty for others for now
    Penang: [
      { label: "George Town", value: "George Town" },
      { label: "Bayan Lepas", value: "Bayan Lepas" },
    ],
    Johor: [
      { label: "Johor Bahru", value: "Johor Bahru" },
      { label: "Iskandar Puteri", value: "Iskandar Puteri" },
    ],
  };

  const [country, setCountry] = useState("马来西亚");

  // Update city change to reset region
  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    setRegion(""); // Reset region when city changes
  };

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
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>创建公会</Text>
            </View>
            <TouchableOpacity
              onPress={handleCreate}
              disabled={creating}
              style={[
                styles.blurButton,
                styles.saveButton,
                creating && { opacity: 0.7 },
              ]}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Check size={18} color="#fff" />
                  <Text style={styles.saveText}>创建</Text>
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
            {coverUri ? (
              <Image source={{ uri: coverUri }} style={styles.coverImage} />
            ) : (
              <View
                style={[
                  styles.coverImage,
                  {
                    backgroundColor: "#1e293b",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                ]}
              >
                <Text style={{ color: "#64748b" }}>点击上传背景图</Text>
              </View>
            )}

            <View style={styles.coverOverlay}>
              <View style={styles.changeCoverBtn}>
                <Camera size={14} color="#fff" />
                <Text style={styles.changeCoverText}>
                  {coverUri ? "更换封面" : "上传封面"}
                </Text>
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
                    <Camera size={24} color="#fff" />
                  </View>
                )}
                <View style={styles.avatarBadge}>
                  <Camera size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.avatarHint}>
                <Text style={styles.hintTitle}>俱乐部头像</Text>
                <Text style={styles.hintSub}>点击上传，建议使用方形图片</Text>
              </View>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>基本信息</Text>

              <InputField
                label="俱乐部名称 *"
                value={name}
                onChangeText={setName}
                placeholder="给你的俱乐部起个响亮的名字"
                icon={<Text style={{ fontSize: 16 }}>🏷️</Text>}
              />

              {/* Location Fields */}
              <SelectField
                label="国家 (Country)"
                value={country}
                options={COUNTRIES}
                onSelect={(val: string) => setCountry(val)}
                disabled={true}
                placeholder="Select Country"
              />

              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label="城市 (City)"
                    value={city}
                    options={CITIES}
                    onSelect={handleCityChange}
                    placeholder="选择城市"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <SelectField
                    label="地区 (Region)"
                    value={region}
                    options={city ? REGIONS[city] || [] : []}
                    onSelect={setRegion}
                    placeholder="选择地区"
                    disabled={!city}
                  />
                </View>
              </View>

              {/* Tag is optional */}
              {/* <InputField
                label="标签 (Tag)"
                value={tag}
                onChangeText={setTag}
                placeholder="例如: AURORA"
                maxLength={10}
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
                <Text style={styles.label}>初始公告</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={announcement}
                  onChangeText={setAnnouncement}
                  placeholder="发布第一条公告..."
                  placeholderTextColor="#64748b"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Reuse styles for SelectField
const SelectField = ({
  label,
  value,
  options,
  onSelect,
  disabled,
  placeholder,
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedLabel =
    options.find((opt: any) => opt.value === value)?.label || value;

  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          { justifyContent: "center" },
          disabled && { opacity: 0.5, backgroundColor: "#2a2a2a" },
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text style={{ color: value ? "#fff" : "#64748b", fontSize: 16 }}>
          {selectedLabel || placeholder}
        </Text>
        <View style={{ position: "absolute", right: 16 }}>
          <Text style={{ color: "#64748b" }}>▼</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {options.map((opt: any) => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(opt.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === opt.value && styles.optionTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {value === opt.value && <Check size={16} color="#10b981" />}
                </TouchableOpacity>
              ))}
              {options.length === 0 && (
                <Text
                  style={{ color: "#64748b", padding: 16, textAlign: "center" }}
                >
                  No options available
                </Text>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContent: {
    paddingBottom: 0,
  },
  floatingHeader: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 50,
  },
  headerTitleContainer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    minHeight: height - 240, // Ensure it fills the rest of the screen
    paddingBottom: 100,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
    maxHeight: "60%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    color: "#94a3b8",
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#10b981",
    fontWeight: "bold",
  },
});
