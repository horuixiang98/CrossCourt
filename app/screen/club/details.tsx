import { useSession } from "@/src/providers/SessionProvider";
import {
  ClubActivity,
  ClubMember,
  ClubProfile,
  getClubActivities,
  getClubById,
  getClubMemberbyClubId,
} from "@/src/services/clubService";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import {
  Award,
  BellOff,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Flame,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  ShieldCheck,
  UserMinus,
  Users,
  X,
  Zap,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CLUB_DATA = {
  name: "极光羽球俱乐部",
  tag: "AURORA",
  logo: "https://images.unsplash.com/photo-1626245917164-21bd2128c149?w=200&h=200&fit=crop",
  cover:
    "https://images.unsplash.com/photo-1521412644187-c49fa356ee68?w=800&q=80",
  memberCount: 128,
  maxMembers: 200,
  rank: 3,
  location: "上海 · 静安体育中心",
  bio: "追求极致的挥拍速度与竞技艺术。极光俱乐部欢迎每一位对羽毛球充满热情的选手，无论段位，只求热爱。",
  stats: [
    { label: "活跃度", value: "A+", color: "#10b981" },
    { label: "总ELO", value: "142k", color: "#ffffff" },
    { label: "胜率", value: "68%", color: "#60a5fa" },
  ],
  announcement:
    "本周六晚上 19:00 将举行内部排位赛，前三名将获得精选球拍手胶奖励，请大家踊跃报名！",
};

// --- Mock Member Data ---
const PENDING_REQUESTS = [
  {
    id: 101,
    name: "暴力杀球王",
    elo: 1850,
    avatar: "🔥",
    note: "浦东第一反手请求入会",
  },
];

const FULL_MEMBERS = [
  {
    id: 1,
    name: "林丹接班人",
    role: "会长",
    elo: 2450,
    winRate: "88%",
    position: "单打",
    status: "在线",
    avatar: "👨‍💼",
    joinDate: "2023-01",
    activity: 98,
  },
  {
    id: 2,
    name: "反手之王",
    role: "副会长",
    elo: 2310,
    winRate: "75%",
    position: "网前",
    status: "在线",
    avatar: "🏸",
    joinDate: "2023-02",
    activity: 92,
  },
  {
    id: 3,
    name: "小羽快跑",
    role: "精英",
    elo: 2150,
    winRate: "68%",
    position: "全能",
    status: "2小时前",
    avatar: "🏃",
    joinDate: "2023-05",
    activity: 85,
  },
  {
    id: 4,
    name: "步法大师",
    role: "成员",
    elo: 1980,
    winRate: "55%",
    position: "后场",
    status: "昨天",
    avatar: "👟",
    joinDate: "2023-08",
    activity: 45,
  },
  {
    id: 5,
    name: "暴力扣杀",
    role: "成员",
    elo: 1850,
    winRate: "60%",
    position: "后场",
    status: "在线",
    avatar: "💥",
    joinDate: "2023-09",
    activity: 77,
  },
  {
    id: 6,
    name: "混双小甜心",
    role: "成员",
    elo: 1720,
    winRate: "52%",
    position: "网前",
    status: "3天前",
    avatar: "👧",
    joinDate: "2023-10",
    activity: 30,
  },
];

const RECENT_HONORS = [
  { id: 1, title: "地区联赛冠军", date: "2天前", icon: "🥇" },
  { id: 2, title: "本月活跃公会榜 TOP 3", date: "1周前", icon: "🔥" },
];

const MEMBERS = FULL_MEMBERS; // For backwards compatibility with existing UI code if needed

export default function ClubDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const [club, setClub] = useState<ClubProfile | null>(null);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [activities, setActivities] = useState<ClubActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Manage Tab State
  const [searchQuery, setSearchQuery] = useState("");
  const [pending, setPending] = useState(PENDING_REQUESTS);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [logoError, setLogoError] = useState(false);
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    if (club) {
      setLogoError(false);
      setCoverError(false);
    }
  }, [club]);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        loadClubDetails();
      }
    }, [id])
  );

  // Fetch members when tab changes to 'members'
  useEffect(() => {
    if (activeTab === "members" && id) {
      fetchMembers();
    }
    if (activeTab === "activities" && id) {
      fetchActivities();
    }
  }, [activeTab, id]);

  const loadClubDetails = async () => {
    try {
      setLoading(true);
      const data = await getClubById(id as string, session?.user?.id);
      setClub(data);
    } catch (error) {
      console.error("Error loading club details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    if (!id) return;
    const data = await getClubMemberbyClubId(id as string);
    if (data) {
      setMembers(data);
    }
  };

  const fetchActivities = async () => {
    if (!id) return;
    const data = await getClubActivities(id as string);
    console.log("Activities:", data);
    if (data) {
      setActivities(data);
    }
  };

  const handleAction = (member: any) => {
    if (member.role === "会长") return;
    setSelectedMember(member);
    setIsManageOpen(true);
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={{ color: "#64748b", marginTop: 12 }}>加载中...</Text>
      </View>
    );
  }

  if (!club) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: "#64748b" }}>找不到该俱乐部</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#10b981" }}>返回</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const clubStats = [
    { label: "活跃度", value: club.stats.active || "A", color: "#10b981" },
    { label: "总ELO", value: club.stats.totalElo, color: "#ffffff" },
    { label: "胜率", value: club.stats.winRate, color: "#60a5fa" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* 1. Header with Cover Image */}
        <View style={styles.headerContainer}>
          <Image
            source={{
              uri:
                !coverError && club.cover
                  ? club.cover
                  : "https://images.unsplash.com/photo-1521412644187-c49fa356ee68?w=800&q=80",
            }}
            style={styles.coverImage}
            onError={() => setCoverError(true)}
          />
          <LinearGradient
            colors={["rgba(5,5,5,0.6)", "transparent", "#050505"]}
            style={styles.gradientOverlay}
          />
          <View style={styles.safeHeader}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.back()}
            >
              <ChevronLeft size={20} color="#fff" />
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 8 }}>
              {/* Bookmark Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  Alert.alert("提示", "置顶公会 (开发中)");
                }}
              >
                <Bookmark size={18} color="#fff" />
              </TouchableOpacity>

              {/* Mute Button */}
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  // Mute toggle (dummy function for now)
                  Alert.alert("提示", "开启/关闭静音 (开发中)");
                }}
              >
                <BellOff size={18} color="#fff" />
              </TouchableOpacity>

              {/* Edit Button (Admin Only) */}
              {(club.role === "会长" || club.role === "管理员") && (
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => {
                    router.push({
                      pathname: "/screen/club/edit",
                      params: { id: club.id },
                    });
                  }}
                >
                  <MoreHorizontal size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 2. Basic Info Section (Negative Margin overlap) */}
        <View style={styles.infoSection}>
          <View style={styles.topRow}>
            {/* Logo Container */}
            <View style={styles.logoWrapper}>
              <View style={styles.logoBorder}>
                {club.logo && !logoError ? (
                  <Image
                    source={{ uri: club.logo }}
                    style={styles.logo}
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <View
                    style={[
                      styles.logo,
                      {
                        backgroundColor: "#1e293b",
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 32 }}>🏸</Text>
                  </View>
                )}
              </View>
              <View style={styles.levelBadge}>
                <ShieldCheck size={10} color="#fff" fill="#fff" />
                <Text style={styles.levelText}>LV.5</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              {!club.role && (
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>加入俱乐部</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.messageButton}
                onPress={() => {
                  if (club.contact_wa) {
                    Linking.openURL(club.contact_wa);
                  }
                }}
              >
                <MessageSquare size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title & Bio */}
          <View style={styles.detailsContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.clubName}>{club.name}</Text>
              {club.tag && (
                <View style={styles.tagBadge}>
                  <Text style={styles.tagText}>{club.tag}</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <MapPin size={12} color="#10b981" />
                <Text style={styles.metaText}>{club.location}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={12} color="#64748b" />
                <Text style={styles.metaText}>
                  {club.memberCount}/{club.maxMembers}
                </Text>
              </View>
            </View>

            <Text style={styles.bioText}>{club.bio}</Text>
          </View>

          {/* Core Stats */}
          <View style={styles.statsRow}>
            {clubStats.map((stat, idx) => (
              <View key={idx} style={styles.statCard}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color }]}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabBar}>
            {["overview", "members", "activities", "events"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={styles.tabItem}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab === "overview"
                    ? "概览"
                    : tab === "members"
                    ? "成员"
                    : tab === "activities"
                    ? "球局"
                    : "赛事"}
                </Text>
                {activeTab === tab && <View style={styles.activeIndicator} />}
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Content */}
          {activeTab === "overview" && (
            <View style={styles.overviewContainer}>
              {/* Announcement */}
              <View style={styles.announcementCard}>
                <View style={styles.announceHeader}>
                  <Zap size={14} color="#10b981" />
                  <Text style={styles.announceTitle}>最新公告</Text>
                </View>
                <Text style={styles.announceContent}>
                  {club.announcement || "暂无公告"}
                </Text>
                <MessageSquare
                  size={80}
                  color="rgba(16, 185, 129, 0.05)"
                  style={styles.bgIcon}
                />
              </View>

              {/* Recent Honors */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>RECENT HONORS</Text>
                  <ChevronRight size={14} color="#334155" />
                </View>
                <View style={styles.listContainer}>
                  {RECENT_HONORS.map((honor) => (
                    <View key={honor.id} style={styles.honorCard}>
                      <View style={styles.honorLeft}>
                        <Text style={styles.honorEmoji}>{honor.icon}</Text>
                        <View>
                          <Text style={styles.honorTitle}>{honor.title}</Text>
                          <Text style={styles.honorDate}>{honor.date}</Text>
                        </View>
                      </View>
                      <Award size={16} color="#1e293b" />
                    </View>
                  ))}
                </View>
              </View>

              {/* Leadership */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>LEADERSHIP</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>查看全部</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.gridContainer}>
                  {MEMBERS.slice(0, 2).map((member) => (
                    <View key={member.id} style={styles.memberCard}>
                      <View style={styles.memberHeader}>
                        <View style={styles.memberAvatar}>
                          <Text style={{ fontSize: 18 }}>👤</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.memberName} numberOfLines={1}>
                            {member.name}
                          </Text>
                          <Text style={styles.memberRole}>{member.role}</Text>
                        </View>
                      </View>
                      <View style={styles.memberFooter}>
                        <Text style={styles.memberElo}>ELO {member.elo}</Text>
                        <View style={styles.statusRow}>
                          <View style={styles.statusDot} />
                          <Text style={styles.statusText}>{member.status}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Members Content */}
          {activeTab === "members" && (
            <View style={styles.membersContainer}>
              {/* Pending Requests */}
              {pending.length > 0 && (
                <View style={styles.pendingCard}>
                  <View style={styles.pendingHeader}>
                    <View style={styles.pendingTitleRow}>
                      <View style={styles.pingContainer}>
                        <View style={styles.pingDot} />
                        <View style={styles.pingRing} />
                      </View>
                      <Text style={styles.pendingTitle}>入会申请</Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>
                        {pending.length}
                      </Text>
                    </View>
                  </View>

                  {pending.map((req) => (
                    <View key={req.id} style={styles.requestItem}>
                      <View style={styles.requestInfo}>
                        <View style={styles.requestAvatar}>
                          <Text style={{ fontSize: 14 }}>{req.avatar}</Text>
                        </View>
                        <View>
                          <Text style={styles.requestName}>{req.name}</Text>
                          <Text style={styles.requestNote} numberOfLines={1}>
                            {req.note}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.requestActions}>
                        <TouchableOpacity
                          onPress={() => setPending([])}
                          style={[styles.actionBtn, styles.rejectBtn]}
                        >
                          <X size={14} color="#ef4444" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => setPending([])}
                          style={[styles.actionBtn, styles.acceptBtn]}
                        >
                          <Check size={14} color="#10b981" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Search & Stats */}
              <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                  <Search size={14} color="#64748b" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="搜索成员名称或特长..."
                    placeholderTextColor="#64748b"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                <View style={styles.statsGrid}>
                  <View style={styles.smallStatCard}>
                    <Text style={styles.smallStatLabel}>平均战力</Text>
                    <Text style={styles.smallStatValue}>2140</Text>
                  </View>
                  <View style={styles.smallStatCard}>
                    <Text style={styles.smallStatLabel}>本周活跃</Text>
                    <Text style={[styles.smallStatValue, { color: "#10b981" }]}>
                      92%
                    </Text>
                  </View>
                </View>
              </View>

              {/* Team Members */}
              <View style={styles.memberGroup}>
                <View style={styles.groupHeader}>
                  <Users size={12} color="#64748b" />
                  <Text style={styles.groupTitle}>团队成员</Text>
                </View>
                <View style={styles.memberList}>
                  {members
                    .filter((m) =>
                      m.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((member) => (
                      <MemberRow
                        key={member.id}
                        member={member}
                        onAction={handleAction}
                      />
                    ))}
                  {members.length === 0 && (
                    <Text
                      style={{
                        color: "#64748b",
                        textAlign: "center",
                        padding: 20,
                      }}
                    >
                      暂无成员
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Activities Content */}
          {activeTab === "activities" && (
            <View style={styles.activitiesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>UPCOMING GAMES</Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() =>
                    router.push({
                      pathname: "/screen/club/create_activity",
                      params: { clubId: id },
                    })
                  }
                >
                  <Plus size={16} color="#050505" />
                </TouchableOpacity>
              </View>

              <View style={styles.activitiesList}>
                {activities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
                {activities.length === 0 && (
                  <Text style={styles.emptyText}>暂无活动</Text>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Manage Action Sheet (Simplified Simulation) */}
      {isManageOpen && (
        <View style={styles.manageOverlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={() => setIsManageOpen(false)}
          />
          <View style={styles.manageSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeader}>
              <View style={styles.sheetAvatar}>
                <Text style={{ fontSize: 32 }}>{selectedMember?.avatar}</Text>
              </View>
              <Text style={styles.sheetName}>{selectedMember?.name}</Text>
              <Text style={styles.sheetSub}>
                公会成员 • ELO {selectedMember?.elo}
              </Text>
            </View>

            <View style={styles.sheetStats}>
              <View style={styles.sheetStatBox}>
                <Text style={styles.sheetStatLabel}>胜率</Text>
                <Text style={[styles.sheetStatValue, { color: "#10b981" }]}>
                  {selectedMember?.winRate}
                </Text>
              </View>
              <View style={styles.sheetStatBox}>
                <Text style={styles.sheetStatLabel}>特长位置</Text>
                <Text style={styles.sheetStatValue}>
                  {selectedMember?.position}
                </Text>
              </View>
            </View>

            <View style={styles.sheetActions}>
              <ActionButton
                icon={<ShieldCheck size={18} color="#3b82f6" />}
                title="提升为副会长"
              />
              <ActionButton
                icon={<Award size={18} color="#a855f7" />}
                title="任命为核心精英"
              />
              <View style={styles.divider} />
              <ActionButton
                icon={<UserMinus size={18} color="#ef4444" />}
                title="移出公会"
                destructive
              />
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsManageOpen(false)}
            >
              <Text style={styles.cancelText}>取消操作</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

// Sub-components
const MemberRow = ({ member, onAction }: { member: any; onAction: any }) => (
  <View style={styles.memberRowCard}>
    <View style={styles.rowLeft}>
      <View style={styles.rowAvatarBox}>
        <View style={styles.rowAvatarBg}>
          <Text style={{ fontSize: 20 }}>{member.avatar}</Text>
        </View>
        {member.status === "在线" && <View style={styles.onlineDot} />}
      </View>
      <View>
        <View style={styles.rowNameContainer}>
          <Text style={styles.rowName}>{member.name}</Text>
          {member.role === "会长" && (
            <Crown size={12} color="#eab308" fill="#eab308" />
          )}
          {member.role === "管理员" && (
            <ShieldCheck size={12} color="#60a5fa" />
          )}
        </View>
        <View style={styles.rowMeta}>
          <View style={styles.metaBadge}>
            <Zap size={10} color="#f59e0b" />
            <Text style={styles.metaBadgeText}>ELO {member.totalElo}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Clock size={10} color="#64748b" />
            <Text style={styles.metaBadgeText}>{member.onlineStatus}</Text>
          </View>
        </View>
      </View>
    </View>

    <View style={styles.rowRight}>
      <View style={{ alignItems: "flex-end", marginRight: 8 }}>
        <Text style={styles.winRateLabel}>胜率</Text>
        <Text style={styles.winRateValue}>{member.winRate}</Text>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => onAction(member)}
      >
        <MoreVertical size={18} color="#64748b" />
      </TouchableOpacity>
    </View>
  </View>
);

const ActionButton = ({
  icon,
  title,
  destructive = false,
}: {
  icon: any;
  title: string;
  destructive?: boolean;
}) => (
  <TouchableOpacity style={styles.actionSheetBtn}>
    <View style={styles.actionSheetLeft}>
      {icon}
      <Text
        style={[styles.actionSheetText, destructive && { color: "#ef4444" }]}
      >
        {title}
      </Text>
    </View>
    <ChevronRight size={16} color="#334155" />
  </TouchableOpacity>
);

const ActivityCard = ({ activity }: { activity: ClubActivity }) => {
  const progress = Math.min(activity.joined / activity.total, 1);
  const isFull = activity.joined >= activity.total;

  return (
    <View style={styles.activityCard}>
      <View style={styles.activityPadding}>
        <View style={styles.activityMainRow}>
          {/* Left Side: Info */}
          <View style={{ flex: 1, marginRight: 12 }}>
            {/* Header: Time & Tags */}
            <View style={styles.activityHeaderRow}>
              <View style={styles.timeTag}>
                <Clock size={12} color="#94a3b8" />
                <Text style={styles.timeTagText}>
                  {activity.date} • {activity.startTime}-{activity.endTime}
                </Text>
              </View>
              {(activity.status === "即将满员" ||
                activity.status === "已满") && (
                <View style={styles.hotTag}>
                  <Flame size={10} color="#f97316" fill="#f97316" />
                  <Text style={styles.hotTagText}>HOT</Text>
                </View>
              )}
            </View>

            <Text style={styles.activityTitle} numberOfLines={2}>
              {activity.title}
            </Text>

            <View style={styles.courtTag}>
              <Text style={styles.courtTagText}>{activity.courts} COURTS</Text>
            </View>

            {/* Location Row */}
            <TouchableOpacity
              style={styles.compactLocationRow}
              onPress={() => {
                const q = activity.location;
                const ll = encodeURIComponent(
                  activity.latitude + "," + activity.longitude
                );
                Linking.openURL(`waze://?q=${q}&ll=${ll}&navigate=yes`);
              }}
            >
              <MapPin size={14} color="#60a5fa" />
              <Text style={styles.compactLocationText} numberOfLines={1}>
                {activity.location}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right Side: Price */}
          <View style={styles.priceColumn}>
            <View style={styles.priceBadge}>
              <View style={styles.priceRowItem}>
                <Text style={styles.priceLabelSmall}>M</Text>
                <Text style={styles.priceValueSmall}>{activity.priceMale}</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceRowItem}>
                <Text style={[styles.priceLabelSmall, { color: "#ec4899" }]}>
                  F
                </Text>
                <Text style={styles.priceValueSmall}>
                  {activity.priceFemale}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Footer: Progress */}
        <View style={styles.cardFooter}>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: isFull ? "#ef4444" : "#10b981",
                },
              ]}
            />
          </View>
          <View style={styles.footerInfo}>
            <View style={styles.participantsAvatarsSmall}>
              {[...Array(Math.min(activity.joined, 3))].map((_, i) => (
                <View key={i} style={styles.avatarCircleSmall}>
                  <Text style={{ fontSize: 8 }}>👤</Text>
                </View>
              ))}
            </View>
            <Text style={styles.slotsTextSmall}>
              {activity.joined}/{activity.total} Joined
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  activitiesContainer: { paddingHorizontal: 4, gap: 16, paddingBottom: 40 },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
  },
  activitiesList: { gap: 12 },
  activityCard: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  activityPadding: { padding: 16 },
  activityMainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  activityHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    lineHeight: 22,
  },

  timeTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  timeTagText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },

  courtTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  courtTagText: { fontSize: 9, fontWeight: "bold", color: "#10b981" },

  hotTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hotTagText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#f97316",
    fontStyle: "italic",
  },

  compactLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
    marginBottom: 10,
    // // backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue bg for interactivity
    // paddingVertical: 6,
    // paddingHorizontal: 10,
    // borderRadius: 12,
    alignSelf: "flex-start",
    // borderWidth: 1,
    // borderColor: "rgba(59, 130, 246, 0.2)",
  },
  compactLocationText: {
    flex: 1,
    fontSize: 11,
    color: "#93c5fd", // Light blue text
    fontWeight: "500",
  },

  // Right Price Column
  priceColumn: { alignItems: "flex-end", paddingTop: 4 },
  priceBadge: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  priceRowItem: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  priceLabelSmall: { fontSize: 10, fontWeight: "900", color: "#60a5fa" },
  priceValueSmall: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    fontStyle: "italic",
  },
  priceDivider: {
    height: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 4,
  },

  // Footer
  cardFooter: { gap: 8 },
  progressBarBg: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2 },
  footerInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantsAvatarsSmall: { flexDirection: "row", paddingLeft: 6 },
  avatarCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#334155",
    borderWidth: 1,
    borderColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -6,
  },
  slotsTextSmall: { fontSize: 10, color: "#64748b", fontWeight: "600" },
  emptyText: { color: "#64748b", textAlign: "center", marginTop: 20 },

  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  headerContainer: {
    height: 240, // h-60
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    transform: [{ scale: 1.05 }],
  },
  gradientOverlay: {
    position: "absolute",
    inset: 0,
  },
  safeHeader: {
    position: "absolute",
    top: 50, // Approximate safe area
    left: 24,
    right: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  infoSection: {
    marginTop: -64, // -mt-16
    paddingHorizontal: 24,
    position: "relative",
    zIndex: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logoWrapper: {
    position: "relative",
  },
  logoBorder: {
    width: 96, // w-24
    height: 96, // h-24
    borderRadius: 32,
    backgroundColor: "#050505",
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
    resizeMode: "cover",
  },
  levelBadge: {
    position: "absolute",
    bottom: -8,
    right: -8,
    backgroundColor: "#10b981", // emerald-500
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 4,
    borderColor: "#050505",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  levelText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  joinButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  joinButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "900",
  },
  messageButton: {
    backgroundColor: "#0f172a", // slate-900
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1e293b", // slate-800
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  clubName: {
    fontSize: 24,
    fontWeight: "900",
    color: "#fff",
    fontStyle: "italic",
    letterSpacing: -0.5,
  },
  tagBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
    letterSpacing: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
  },
  bioText: {
    fontSize: 12,
    color: "#94a3b8",
    lineHeight: 18,
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 12,
  },
  statLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    fontStyle: "italic",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 24,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabText: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#475569",
  },
  tabTextActive: {
    color: "#fff",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 2,
    backgroundColor: "#10b981",
  },
  overviewContainer: {
    gap: 24,
  },
  announcementCard: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 16,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  announceHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  announceTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  announceContent: {
    fontSize: 12,
    color: "rgba(209, 250, 229, 0.8)",
    fontWeight: "500",
    lineHeight: 18,
  },
  bgIcon: {
    position: "absolute",
    right: -16,
    bottom: -16,
  },
  sectionBlock: {},
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    fontStyle: "italic",
    letterSpacing: 1,
    color: "#64748b",
  },
  listContainer: {
    gap: 12,
  },
  honorCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 16,
  },
  honorLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  honorEmoji: {
    fontSize: 24,
  },
  honorTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  honorDate: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#10b981",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  memberCard: {
    width: (width - 48 - 12) / 2, // 2 columns
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 16,
  },
  memberHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  memberName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  memberRole: {
    fontSize: 9,
    color: "#10b981",
    fontWeight: "bold",
    marginTop: 2,
  },
  memberFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberElo: {
    fontSize: 9,
    fontWeight: "900",
    color: "#64748b",
    fontStyle: "italic",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10b981",
  },
  statusText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#64748b",
  },
  // Members Tab Styles
  membersContainer: {
    paddingHorizontal: 4,
    gap: 24,
  },
  pendingCard: {
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
    borderRadius: 16,
    padding: 16,
  },
  pendingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pendingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pingContainer: {
    width: 8,
    height: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pingDot: {
    width: 6,
    height: 6,
    backgroundColor: "#10b981",
    borderRadius: 3,
    zIndex: 2,
  },
  pingRing: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 4,
    opacity: 0.5,
    transform: [{ scale: 1.5 }],
  },
  pendingTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  pendingBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    color: "#050505",
  },
  requestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  requestInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  requestAvatar: {
    width: 32,
    height: 32,
    backgroundColor: "#1e293b",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  requestName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#f8fafc",
  },
  requestNote: {
    fontSize: 10,
    color: "#64748b",
    width: 120,
  },
  requestActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
  },
  rejectBtn: { backgroundColor: "rgba(239, 68, 68, 0.1)" },
  acceptBtn: { backgroundColor: "rgba(16, 185, 129, 0.1)" },
  searchSection: { gap: 12 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  smallStatCard: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.4)",
    borderWidth: 1,
    borderColor: "#0f172a",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  smallStatLabel: {
    fontSize: 9,
    color: "#64748b",
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  smallStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#cbd5e1",
    fontStyle: "italic",
  },
  memberGroup: { gap: 12 },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  memberList: { gap: 12 },
  filterOptions: {
    flexDirection: "row",
    gap: 12,
  },
  filterText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748b",
  },
  memberRowCard: {
    backgroundColor: "rgba(15, 23, 42, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(15, 23, 42, 0.5)",
    padding: 16,
    borderRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  rowAvatarBox: {
    position: "relative",
  },
  rowAvatarBg: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: "#10b981",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#050505",
  },
  rowNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rowName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#e2e8f0",
  },
  rowMeta: {
    flexDirection: "row",
    gap: 12,
    marginTop: 6,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaBadgeText: {
    fontSize: 10,
    color: "#64748b",
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  winRateLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: "#64748b",
    textTransform: "uppercase",
  },
  winRateValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#10b981",
    fontStyle: "italic",
  },
  moreButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  // Manage Sheet Overlay
  manageOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  manageSheet: {
    backgroundColor: "#020617",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    padding: 32,
    paddingBottom: 48,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#1e293b",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 32,
  },
  sheetHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  sheetAvatar: {
    width: 80,
    height: 80,
    backgroundColor: "#0f172a",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  sheetName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 12,
    color: "#64748b",
  },
  sheetStats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  sheetStatBox: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  sheetStatLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  sheetStatValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  sheetActions: {
    gap: 8,
    marginBottom: 24,
  },
  actionSheetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  actionSheetLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionSheetText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#cbd5e1",
  },
  divider: {
    height: 1,
    backgroundColor: "#0f172a",
    marginVertical: 8,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
