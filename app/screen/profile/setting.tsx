import { useSession } from "@/src/providers/SessionProvider";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Bell,
  ChevronRight,
  Globe,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  LucideIcon,
  Moon,
  Shield,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function SettingsScreen() {
  const { session } = useSession();
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("player_profile")
        .select(`nickname, avatar_url`)
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        if (data.nickname) setUsername(data.nickname);
      }
    } catch (error) {
      console.error("Error fetching profile in settings:", error);
    } finally {
      setLoading(false);
    }
  }

  const SettingItem = ({
    Icon,
    title,
    value,
    onPress,
    color = "#64748b",
  }: {
    Icon: LucideIcon;
    title: string;
    value?: string;
    onPress?: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.menuIconContainer, { backgroundColor: `${color}15` }]}
      >
        <Icon size={18} color={color} />
      </View>
      <Text style={styles.menuTitle}>{title}</Text>
      <View style={styles.valueContainer}>
        {value && <Text style={styles.menuValue}>{value}</Text>}
        <ChevronRight size={16} color="#1e293b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topGlow} />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color="#f8fafc" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>设置</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.userInfoCard}>
            <View style={styles.avatarPlaceholder}>
              <User size={32} color="#10b981" />
            </View>
            <View>
              <Text style={styles.userName}>{username}</Text>
              <Text style={styles.userEmail}>{session?.user?.email}</Text>
            </View>
          </View>

          {/* General Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>通用设置</Text>
            <SettingItem
              Icon={User}
              title="个人资料"
              onPress={() => router.push("/screen/profile/profile_Information")}
              color="#10b981"
            />
            <SettingItem
              Icon={Moon}
              title="深色模式"
              value="开启"
              color="#3b82f6"
            />
            <SettingItem
              Icon={Globe}
              title="语言"
              value="简体中文"
              color="#f59e0b"
            />
            <SettingItem Icon={Bell} title="消息通知" color="#ec4899" />
          </View>

          {/* Privacy Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>隐私与安全</Text>
            <SettingItem Icon={Lock} title="账号安全" color="#64748b" />
            <SettingItem Icon={Shield} title="隐私设置" color="#64748b" />
          </View>

          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>关于</Text>
            <SettingItem
              Icon={Info}
              title="关于 CrossCourt"
              value="v1.0.4"
              color="#10b981"
            />
            <SettingItem Icon={HelpCircle} title="帮助中心" color="#64748b" />
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => supabase.auth.signOut()}
          >
            <LogOut size={20} color="#ef4444" style={{ marginRight: 12 }} />
            <Text style={styles.signOutText}>退出登录</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>MADE WITH POWER BY JUSTHI TEAM</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#050505",
  },
  topGlow: {
    position: "absolute",
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f8fafc",
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
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  userInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#475569",
    marginLeft: 8,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "rgba(15, 23, 42, 0.2)",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.2)",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#f8fafc",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: 13,
    color: "#64748b",
    marginRight: 8,
    fontWeight: "500",
  },
  signOutButton: {
    marginTop: 8,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "rgba(239, 68, 68, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.1)",
  },
  signOutText: {
    color: "#ef4444",
    fontSize: 15,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 10,
    color: "#1e293b",
    fontWeight: "900",
    letterSpacing: 2,
  },
});
