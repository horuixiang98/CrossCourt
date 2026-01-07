import { supabase } from "@/src/utils/supabase";

export interface PlayerProfile {
  id: string;
  username: string | null;
  nickname: string | null;
  website: string | null;
  favorite_racket: string | null;
  gender: string | null;
  birthday: Date | null;
  region: string | null;
  country: string | null;
  play_years: number | null;
  handedness: string | null;
  credit_score: number | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PlayerStats {
  id: string;
  current_elo: number;
  highest_elo: number;
  rank_id: string | null;
  season_wins: number;
  season_losses: number;
  technical_radar: {
    power: number;
    speed: number;
    technique: number;
    stamina: number;
    strategy: number;
  } | null;
  rank?: {
    rank_name: string;
    min_elo: number;
    max_elo: number;
  } | null;
}

export const getPlayerProfile = async (userId: string): Promise<PlayerProfile | null> => {
  try {
    const { data, error, status } = await supabase
      .from("player_profile")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return data as PlayerProfile;
  } catch (error) {
    console.error("Error fetching player profile:", error);
    return null;
  }
};

export const getPlayerStats = async (userId: string): Promise<PlayerStats | null> => {
  try {
    const { data, error, status } = await supabase
      .from("player_stats")
      .select(`
        *,
        rank:c_level_rank(*)
      `)
      .eq("id", userId)
      .single();

    if (error && status !== 406) {
      // If no stats exist yet, return null rather than throwing
      return null;
    }

    return data as any;
  } catch (error) {
    console.error("Error fetching player stats:", error);
    return null;
  }
};

export const updatePlayerProfile = async (
  userId: string,
  profile: Partial<Omit<PlayerProfile, "id" | "created_at">>
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from("player_profile")
      .upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating player profile:", error);
    return { success: false, error };
  }
};
