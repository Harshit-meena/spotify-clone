import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import {usePlayer} from "./usePlayer";
import {useGetSongById} from "./useGetSongById";

interface LyricsLine {
  text: string;
  time: number;
}

interface LyricsState {
  lines: LyricsLine[];
  rawLyrics: string;
  isLoading: boolean;
  error: string | null;
  currentLineIndex: number;
  source: "database" | "api" | null;
}

const useLyrics = (currentTime: number = 0) => {
  const player = usePlayer();
  const { supabaseClient } = useSessionContext();
  const { song } = useGetSongById(player.activeId || "");

  const [state, setState] = useState<LyricsState>({
    lines: [],
    rawLyrics: "",
    isLoading: false,
    error: null,
    currentLineIndex: 0,
    source: null,
  });

  useEffect(() => {
    if (!song) {
      setState({
        lines: [],
        rawLyrics: "",
        isLoading: false,
        error: null,
        currentLineIndex: 0,
        source: null,
      });
      return;
    }

    const fetchLyrics = async () => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        lines: [],
        source: null,
      }));

      try {
        // ✅ Step 1: Supabase database se lyrics fetch karo
        const { data: songData } = await supabaseClient
          .from("songs")
          .select("lyrics")
          .eq("id", song.id)
          .single();

        if (songData?.lyrics && songData.lyrics.trim() !== "") {
          // Database mein lyrics hain - use karo
          const parsedLines = parseLyricsToLines(songData.lyrics);
          setState((prev) => ({
            ...prev,
            lines: parsedLines,
            rawLyrics: songData.lyrics,
            isLoading: false,
            error: null,
            source: "database",
          }));
          return;
        }

        // ✅ Step 2: Database mein nahi - API try karo
        const title = encodeURIComponent(
          song.title
            .replace(/\(.*?\)/g, "")
            .replace(/feat\..*/gi, "")
            .trim()
        );
        const artist = encodeURIComponent(
          song.author
            .replace(/\(.*?\)/g, "")
            .replace(/feat\..*/gi, "")
            .trim()
        );

        // lyrics.ovh API
        const apiResponse = await fetch(
          `https://api.lyrics.ovh/v1/${artist}/${title}`
        );

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.lyrics && data.lyrics.trim() !== "") {
            const parsedLines = parseLyricsToLines(data.lyrics);

            // API se mili lyrics ko database mein save karo
            await supabaseClient
              .from("songs")
              .update({ lyrics: data.lyrics })
              .eq("id", song.id);

            setState((prev) => ({
              ...prev,
              lines: parsedLines,
              rawLyrics: data.lyrics,
              isLoading: false,
              error: null,
              source: "api",
            }));
            return;
          }
        }

        // ✅ Step 3: Dono jagah se nahi mili
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Lyrics not available for this song",
          lines: [],
          source: null,
        }));

      } catch (err) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to load lyrics",
          lines: [],
        }));
      }
    };

    fetchLyrics();
  }, [song?.id]);

  // Update current line based on time
  useEffect(() => {
    if (state.lines.length === 0) return;

    const currentIndex = state.lines.reduce((acc, line, index) => {
      if (currentTime >= line.time) return index;
      return acc;
    }, 0);

    if (currentIndex !== state.currentLineIndex) {
      setState((prev) => ({
        ...prev,
        currentLineIndex: currentIndex,
      }));
    }
  }, [currentTime, state.lines]);

  return {
    lines: state.lines,
    rawLyrics: state.rawLyrics,
    isLoading: state.isLoading,
    error: state.error,
    currentLineIndex: state.currentLineIndex,
    source: state.source,
    songTitle: song?.title || "",
    songAuthor: song?.author || "",
  };
};

// Helper: Lyrics text ko timed lines mein convert karo
const parseLyricsToLines = (lyrics: string): { text: string; time: number }[] => {
  const lines = lyrics
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  // Average song mein ~3 seconds per line
  return lines.map((text, index) => ({
    text,
    time: index * 3,
  }));
};

export default useLyrics;