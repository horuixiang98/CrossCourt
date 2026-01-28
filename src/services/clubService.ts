import { supabase } from "@/src/utils/supabase";

export interface ClubProfile {
  id: string;
  name: string;
  tag: string;
  logo: string;
  cover: string;
  memberCount: number;
  maxMembers: number;
  rank: number;
  location: string;
  bio: string;
  stats: {
    active: string;
    totalElo: string;
    winRate: string;
  };
  announcement: string;
  role: string | null;
  activeAct: number;
  contact_wa: string;
}

const mapClubData = (club: any, memberCount: number, role: string | null, activeActivitiesCount: number): ClubProfile => ({
  id: club.id,
  name: club.club_name,
  tag: club.tag,
  logo: club.logo_url,
  cover: club.cover_img,
  memberCount: memberCount || 0,
  maxMembers: 50,
  rank: 1,
  location: club.region + " • " + club.city || "",
  bio: club.bio || "",
  stats: {
    active: club.active_scoring?.toString() || "0",
    totalElo: club.total_elo?.toString() || "0",
    winRate: club.win_rate?.toString() || "%",
  },
  role: role,
  announcement: club.announcement || "",
  activeAct: activeActivitiesCount,
  contact_wa: club.contact_wa || "",
});

export interface ClubMember {
  id: string;
  name: string;
  role: string;
  contribution: number;
  winRate: number;
  totalElo: number;
  onlineStatus: string;
}

const mapClubMemberData = (member: any): ClubMember => ({
    id: member.id,
    name: member.player_profile?.nickname || "Unknown",
    role: member.role,
    contribution: member.contributed_scoring || 0,
    winRate: 0, // Placeholder
    totalElo: 1000, // Placeholder
    onlineStatus: "Offline", // Placeholder
});



const getSignedUrl = async (pathOrUrl: string | null): Promise<string | null> => {
  if (!pathOrUrl) return null;
  // If it's already a full http URL (e.g. from Unsplash or legacy public URL), check if we can/need to sign it
  // For simplicity: If it starts with "http" AND contains our storage URL, we might want to extract path.
  // BUT: Easier strategy -> Future uploads store relative path. Existing uploads are public URLs (now broken).
  // If we want to support existing broken public URLs, we'd need to parse them.
  // Assuming "logos/" or "covers/" prefix implies it's a storage path.
  
  if (pathOrUrl.startsWith("http")) {
    const isSupabaseStorage = pathOrUrl.includes("/storage/v1/object/public/avatars/");
    if (isSupabaseStorage) {
      const path = pathOrUrl.split("/storage/v1/object/public/avatars/")[1];
      const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 3600);
      return data?.signedUrl || pathOrUrl;
    }
    return pathOrUrl;
  }

  // It's a path (new behavior)
  const { data } = await supabase.storage.from("avatars").createSignedUrl(pathOrUrl, 3600);
  return data?.signedUrl || null;
};

export const getJoinedClubProfile = async (userId: string | null): Promise<ClubProfile[]> => {
  try {
    const { data: clubMembers } = await supabase.from("club_member").select("*").eq("player_id", userId);

    if (!clubMembers || clubMembers.length === 0) return [];

    const clubIds = clubMembers.map((m) => m.club_id);

    const { data: clubs, error } = await supabase.from("club").select("*").in("id", clubIds);
    if (error) throw error;

    const { data: activities } = await supabase
      .from("club_activity")
      .select("club_id")
      .in("club_id", clubIds)
      .gte("date", new Date().toISOString().split('T')[0]);

    const items = await Promise.all((clubs || []).map(async (club) => {
      const { count: totalMemberCount } = await supabase.from("club_member").select("*", { count: "exact", head: true }).eq("club_id", club.id);
      const role = clubMembers.find((m) => m.club_id === club.id)?.role || null;
      const clubActivities = activities?.filter((a) => a.club_id === club.id) || [];
      
      // Sign URLs
      const signedLogo = await getSignedUrl(club.logo_url);
      const signedCover = await getSignedUrl(club.cover_img);
      const clubWithSignedUrls = { ...club, logo_url: signedLogo, cover_img: signedCover };

      return mapClubData(clubWithSignedUrls, totalMemberCount || 0, role, clubActivities.length);
    }));
    
    return items;
  } catch (error) {
    console.error("Error fetching joined clubs:", error);
    return [];
  }
};

export const getClubById = async (clubId: string, userId?: string): Promise<ClubProfile | null> => {
  try {
    // 1. Get club details
    const { data: club, error } = await supabase.from("club").select("*").eq("id", clubId).single();
    if (error) throw error;

    // 2. Get member count
    const { count: memberCount } = await supabase.from("club_member").select("*", { count: "exact", head: true }).eq("club_id", clubId);

    // 3. Get user's role if userId provided
    let role = null;
    if (userId) {
      const { data: membership } = await supabase.from("club_member").select("role").eq("club_id", clubId).eq("player_id", userId).single();
      role = membership?.role || null;
    }

    // 4. Get active activities
    const { data: activities } = await supabase
      .from("club_activity")
      .select("id")
      .eq("club_id", clubId)
      .gte("date", new Date().toISOString().split('T')[0]);

    // Sign URLs
    const signedLogo = await getSignedUrl(club.logo_url);
    const signedCover = await getSignedUrl(club.cover_img);
    const clubWithSignedUrls = { ...club, logo_url: signedLogo, cover_img: signedCover };

    return mapClubData(clubWithSignedUrls, memberCount || 0, role, activities?.length || 0);
  } catch (error) {
    console.error("Error fetching club by ID:", error);
    return null;
  }
};

export const getClubMemberbyClubId = async (clubId: string) => {
  try {
    const { data: clubMembers } = await supabase.from("club_member").select("*").eq("club_id", clubId);
    
    if (!clubMembers || clubMembers.length === 0) return [];

    const { data: playerProfiles } = await supabase
      .from("player_profile")
      .select("*")
      .in("id", clubMembers.map((m) => m.player_id));

    const playerProfileMap = new Map(playerProfiles?.map((p) => [p.id, p]));

    const joinedMembers = clubMembers.map((m) => ({
      ...m,
      player_profile: playerProfileMap.get(m.player_id),
    }));

    // console.log(joinedMembers)
    return joinedMembers.map(mapClubMemberData);
  } catch (error) {
    console.error("Error fetching club members by club ID:", error);
    return [];
  }
}

export const uploadClubAvatar = async (clubId: string, uri: string): Promise<{ publicUrl: string | null; error: any }> => {
  try {
    // 1. Convert URI to Blob/ArrayBuffer for upload
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `logos/${clubId}/${fileName}`;

    // 2. Upload to Supabase Storage (assuming 'avatars' bucket exists)
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // 3. Store relative path instead of public URL for private buckets
    // But we return a signed URL so the frontend can display it immediately
    const { data: signedData } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    // 4. Update the club's logo_url in the database to the PATH
    const { error: updateError } = await supabase
      .from('club')
      .update({ logo_url: filePath }) 
      .eq('id', clubId);

    if (updateError) throw updateError;

    return { publicUrl: signedData?.signedUrl || null, error: null };
  } catch (error) {
    console.error('Error in uploadClubAvatar:', error);
    return { publicUrl: null, error };
  }
};

export const uploadClubCover = async (clubId: string, uri: string): Promise<{ publicUrl: string | null; error: any }> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();
    
    const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${Date.now()}_cover.${fileExt}`;
    const filePath = `covers/${clubId}/${fileName}`;

    // Upload to 'avatars' bucket
    const { data, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt === 'png' ? 'png' : 'jpeg'}`,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Store relative path, return signed URL
    const { data: signedData } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    const { error: updateError } = await supabase
      .from('club')
      .update({ cover_img: filePath })
      .eq('id', clubId);

    if (updateError) throw updateError;

    return { publicUrl: signedData?.signedUrl || null, error: null };
  } catch (error) {
    console.error('Error in uploadClubCover:', error);
    return { publicUrl: null, error };
  }
};

export const createClub = async (
  userId: string,
  details: {
    name: string;
    tag?: string;
    bio?: string;
    creator_id?: string;
    announcement?: string;
    contact_wa?: string;
    region: string;
    city: string;
    country?: string;
  }
): Promise<{ success: boolean; clubId?: string; error?: any }> => {
  try {
    // 1. Create the club record
    const { data: club, error: createError } = await supabase
      .from("club")
      .insert({
        club_name: details.name,
        tag: details.tag || "",
        bio: details.bio || "",
        creator_id: details.creator_id || "",
        announcement: details.announcement || "",
        contact_wa: details.contact_wa || "",
        region: details.region,
        city: details.city,
        country: details.country || "马来西亚",
      })
      .select()
      .single();

    if (createError) throw createError;

    // 2. Add creator as a member (President/Admin)
    // Using '会长' (President) or 'admin' based on app norms. 
    // The previous file showed '会长' in the mock data, but database usually uses codes like 'admin' or 'owner'.
    // We will use 'admin' as a safe default for logic, or maybe 'owner'.
    // Let's assume 'admin' based on common practices, or 'president' if specific.
    // Looking at getJoinedClubProfile: const role = clubMembers.find...
    // Let's stick to 'admin' for now.
    const { error: memberError } = await supabase.from("club_member").insert({
      club_id: club.id,
      player_id: userId,
      role: "会长", // This grants management rights
    });

    if (memberError) {
      console.error("Error adding creator as member:", memberError);
      // We might want to rollback club creation here ideally
    }

    return { success: true, clubId: club.id };
  } catch (error) {
    console.error("Error in createClub:", error);
    return { success: false, error };
  }
};

export const updateClub = async (clubId: string, updates: Partial<ClubProfile>): Promise<{ success: boolean; error: any }> => {
  try {
    // Map ClubProfile fields back to DB columns
    const dbUpdates: any = {};
    if (updates.name !== undefined) dbUpdates.club_name = updates.name;
    if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
    if (updates.announcement !== undefined) dbUpdates.announcement = updates.announcement;
    if (updates.contact_wa !== undefined) dbUpdates.contact_wa = updates.contact_wa;
    // if (updates.location !== undefined) {
    //    // Simple location string split for now, or just save to region/city based on format
    //    // For this implementation, we'll try to save to 'region' if it looks like a single string
    //    dbUpdates.region = updates.location; 
    // }

    const { error } = await supabase
      .from('club')
      .update(dbUpdates)
      .eq('id', clubId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateClub:', error);
    return { success: false, error };
  }
};

export interface ClubActivity {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  latitude: number;
  longitude: number;
  priceMale: number;
  priceFemale: number;
  courts: number;
  joined: number;
  total: number;
  status: string;
  participants: string[];
}

const mapActivity = (a: any, joinedCount: number): ClubActivity => {
  const total = a.max_players || 20;
  const joined = joinedCount;
  const isFull = joined >= total;
  
  return {
    id: a.id,
    title: a.name || "羽毛球活动",
    startTime: a.start_time?.slice(0, 5) || "00:00",
    endTime: a.end_time?.slice(0, 5) || "00:00",
    date: a.date,
    location: a.location || "",
    latitude: a.location_lat || 0,
    longitude: a.location_lon || 0,
    priceMale: a.fee_per_male || 0,
    priceFemale: a.fee_per_female || 0,
    courts: a.court_count || 1,
    joined: joined,
    total: total,
    status: isFull ? "已满" : (joined >= total * 0.8 ? "即将满员" : "报名中"),
    participants: [], // Placeholder
  };
};

export const getClubActivities = async (clubId: string): Promise<ClubActivity[]> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // We select basic info. For joined count, we might need a separate query or a join if relations are set up.
    // Assuming 'club_activity_participant' exists and is related.
    const { data: activities, error } = await supabase
      .from('club_activity')
      .select(`
        *,
        club_activity_participant (count)
      `)
      .eq('club_id', clubId)
      .gte('date', today)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    console.log("Activitiesss:", activities);

    if (error) {
       // Fallback if relation doesn't exist or other error, try simple select
       const { data: simpleActivities, error: simpleError } = await supabase
         .from('club_activity')
         .select('*')
         .eq('club_id', clubId)
         .gte('date', today)
         .order('date', { ascending: true });
         
       if (simpleError) throw simpleError;
       
       return (simpleActivities || []).map((a: any) => mapActivity(a, 0));
    }

    return (activities || []).map((a: any) => mapActivity(a, a.club_activity_participant?.[0]?.count || 0));
  } catch (error) {
    console.error('Error fetching club activities:', error);
    return [];
  }
};
