import { useSession } from "@/src/providers/SessionProvider";
import { getPlayerProfile } from "@/src/services/playerProfileService";
import { supabase } from "@/src/utils/supabase";
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  LucideIcon,
  Settings,
  Shield,
  Ticket,
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

export default function Profile() {
  const { session } = useSession();
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.id) fetchProfile();
  }, [session]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!session?.user?.id) throw new Error("No user on the session!");

      const data = await getPlayerProfile(session.user.id);

      if (data?.nickname) {
        setUsername(data.nickname);
      }
    } catch (error) {
      console.error("Error fetching profile in tab:", error);
    } finally {
      setLoading(false);
    }
  };

  const MenuItem = ({
    Icon,
    title,
    subtitle,
    onPress,
    color = "#64748b",
  }: {
    Icon: LucideIcon;
    title: string;
    subtitle: string;
    onPress?: () => void;
    color?: string;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View
        style={[styles.menuIconContainer, { backgroundColor: `${color}15` }]}
      >
        <Icon size={20} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <ChevronRight size={18} color="#1e293b" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topGlow} />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerInfo}>
              <Text style={styles.welcomeLabel}>会员中心</Text>
              <Text style={styles.headerName}>{username}</Text>
              <Text style={styles.headerEmail}>{session?.user?.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.headerMenuButton}
              onPress={() => router.push("/screen/profile/setting")}
            >
              <Settings size={22} color="#f8fafc" />
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>账户设置</Text>
            <MenuItem
              Icon={User}
              title="个人资料"
              subtitle="修改昵称、头像及联系方式"
              onPress={() => router.push("/screen/profile/profile_Information")}
              color="#10b981"
            />
            <MenuItem
              Icon={Settings}
              title="系统偏好"
              subtitle="主题模式、语言设置"
              color="#3b82f6"
            />
            <MenuItem
              Icon={CreditCard}
              title="支付方式"
              subtitle="绑定银行卡、支付宝/微信"
              color="#f59e0b"
            />
            <MenuItem
              Icon={Ticket}
              title="优惠券"
              subtitle="查看所有活动券及折扣"
              color="#ec4899"
            />
            <MenuItem
              Icon={Bell}
              title="消息通知"
              subtitle="推送通知及提醒偏好"
              color="#a78bfa"
            />
          </View>

          {/* Help & Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>帮助与支持</Text>
            <MenuItem
              Icon={Shield}
              title="隐私政策"
              subtitle="了解我们如何保护您的数据"
              color="#64748b"
            />
            <MenuItem
              Icon={FileText}
              title="服务条款"
              subtitle="使用 CrossCourt 的相关规范"
              color="#64748b"
            />
            <MenuItem
              Icon={HelpCircle}
              title="常见问题"
              subtitle="寻求帮助或联系客服"
              color="#64748b"
            />
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={() => supabase.auth.signOut()}
          >
            <LogOut size={20} color="#ef4444" style={{ marginRight: 12 }} />
            <Text style={styles.signOutText}>退出登录</Text>
          </TouchableOpacity>
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
    left: -width * 0.2,
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderRadius: 80,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  headerInfo: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 10,
    color: "#10b981",
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8fafc",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerEmail: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  headerMenuButton: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.5)",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#475569",
    marginLeft: 24,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(30, 41, 59, 0.3)",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#f8fafc",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "500",
  },
  signOutButton: {
    marginHorizontal: 24,
    marginTop: 24,
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
});
