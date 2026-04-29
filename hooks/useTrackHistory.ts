import { useEffect, useRef } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { usePlayer } from "./usePlayer";
import { Song } from "@/types";

const useTrackHistory = (currentSong: Song | null) => {
  const { supabaseClient } = useSessionContext();
  const startTimeRef = useRef<number | null>(null);
  const { activeId } = usePlayer();

  useEffect(() => {
    if (!currentSong || !activeId) return;

    // Song start hone ka time record karo
    startTimeRef.current = Date.now();

    // Get user
    const trackPlay = async () => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) return;

      // Insert listening history
      await supabaseClient.from("listening_history").insert({
        user_id: session.user.id,
        song_id: currentSong.id,
        played_at: new Date().toISOString(),
        duration_listened: 0,
        completed: false,
      });
    };

    trackPlay();

    // Cleanup - jab song change ho
    return () => {
      if (startTimeRef.current) {
        const duration = Math.floor(
          (Date.now() - startTimeRef.current) / 1000
        );

        const updateDuration = async () => {
          const {
            data: { session },
          } = await supabaseClient.auth.getSession();

          if (!session?.user) return;

          // Update duration
          await supabaseClient
            .from("listening_history")
            .update({
              duration_listened: duration,
              completed: duration > 30, // 30 sec se zyada = completed
            })
            .eq("user_id", session.user.id)
            .eq("song_id", currentSong.id)
            .order("played_at", { ascending: false })
            .limit(1);
        };

        updateDuration();
        startTimeRef.current = null;
      }
    };
  }, [activeId, currentSong]);
};

export default useTrackHistory;