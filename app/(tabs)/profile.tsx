import { Colors } from "@/constants/theme";
import { useSession } from "@/src/providers/SessionProvider";
import { getPlayerProfile } from "@/src/services/playerProfileService";
import { supabase } from "@/src/utils/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Scroll-to-hide feature removed at user request
  };

  const MenuItem = ({
    icon,
    title,
    subtitle,
    onPress,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={24} color={Colors.light.text} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.light.icon}
        style={styles.menuArrow}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{username}</Text>
            <Text style={styles.headerEmail}>{session?.user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerMenuButton}
            onPress={() => router.push("/screen/profile/setting")}
          >
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <MenuItem
            icon="person-outline"
            title="Profile information"
            subtitle="Change number, email id"
            onPress={() => router.push("/screen/profile/profile_Information")}
          />
          <MenuItem
            icon="options-outline"
            title="Preferences"
            subtitle="Theme, travel preferences"
          />
          <MenuItem
            icon="card-outline"
            title="Payment methods"
            subtitle="Saved cards, Paypal"
          />
          <MenuItem
            icon="ticket-outline"
            title="Coupons"
            subtitle="All vPasses & vouchers"
          />
          <MenuItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Push notifications"
          />
        </View>

        {/* Help & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <MenuItem
            icon="lock-closed-outline"
            title="Privacy policy"
            subtitle="Security notifications"
          />
          <MenuItem
            icon="document-text-outline"
            title="Terms & Conditions"
            subtitle="Cancellation policy"
          />
          <MenuItem
            icon="help-circle-outline"
            title="FAQ & Help"
            subtitle="Get in touch with us"
          />
        </View>

        {/* Sign Out Button (Added for functionality) */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => supabase.auth.signOut()}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  headerMenuButton: {
    padding: 8,
    marginTop: -8,
    marginRight: -8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.icon,
    marginLeft: 24,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuIconContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: 4,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 12,
    color: Colors.light.icon,
  },
  menuArrow: {
    opacity: 0.5,
  },
  signOutButton: {
    marginHorizontal: 24,
    marginTop: 10,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff4444",
    borderRadius: 12,
  },
  signOutText: {
    color: "#ff4444",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    padding: 20,
    backgroundColor: Colors.light.background,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: Colors.light.icon,
  },
});
