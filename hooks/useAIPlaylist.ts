import { useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";
import { Song } from "@/types";

interface AIPlaylistData {
  name: string;
  description: string;
  songs: Song[];
  mood: string;
}

const useAIPlaylist = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState<AIPlaylistData | null>(null);
  const { supabaseClient } = useSessionContext();

  const generatePlaylist = async (prompt: string) => {
    try {
      setIsGenerating(true);

      const response = await fetch("/api/generate-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("API call failed");

      const aiData = await response.json();

      // Fetch matching songs from database
      const songs = await findMatchingSongs(aiData.songs || []);

      const finalPlaylist: AIPlaylistData = {
        name: aiData.name || `${prompt} Playlist`,
        description: aiData.description || "AI generated playlist",
        songs,
        mood: prompt,
      };

      setPlaylist(finalPlaylist);

      if (songs.length === 0) {
        toast.error("No songs found! Please upload songs first.");
      } else if (songs.length < 4) {
        toast.success(
          `Playlist ready! (${songs.length} songs found in database)`
        );
      } else {
        toast.success("AI Playlist is ready! 🎉");
      }

      return finalPlaylist;
    } catch (err: any) {
      console.error("Playlist Error:", err);
      toast.error("Failed to generate playlist!");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const findMatchingSongs = async (
    aiSongs: { title: string; artist: string; genre: string }[]
  ): Promise<Song[]> => {
    // Fetch all songs from database
    const { data: allDbSongs } = await supabaseClient
      .from("songs")
      .select("*");

    if (!allDbSongs || allDbSongs.length === 0) return [];

    // If 8 or fewer songs exist, return all shuffled
    if (allDbSongs.length <= 8) {
      return [...allDbSongs].sort(() => Math.random() - 0.5);
    }

    const matchedSongs: Song[] = [];
    const usedIds = new Set<string>();

    // Try to match AI suggested songs
    for (const aiSong of aiSongs) {
      // Try title match first
      let { data: songs } = await supabaseClient
        .from("songs")
        .select("*")
        .ilike("title", `%${aiSong.title}%`)
        .limit(1);

      // Try author match if title not found
      if (!songs || songs.length === 0) {
        ({ data: songs } = await supabaseClient
          .from("songs")
          .select("*")
          .ilike("author", `%${aiSong.artist}%`)
          .limit(1));
      }

      // Try genre match if author not found
      if (!songs || songs.length === 0) {
        ({ data: songs } = await supabaseClient
          .from("songs")
          .select("*")
          .ilike("genre", `%${aiSong.genre}%`)
          .limit(1));
      }

      if (songs) {
        for (const song of songs) {
          if (!usedIds.has(song.id)) {
            matchedSongs.push(song);
            usedIds.add(song.id);
          }
        }
      }
    }

    // Fill remaining spots with random songs
    if (matchedSongs.length < 8) {
      const remaining = allDbSongs
        .filter((s: Song) => !usedIds.has(s.id))
        .sort(() => Math.random() - 0.5);

      const needed = 8 - matchedSongs.length;
      matchedSongs.push(...remaining.slice(0, needed));
    }

    return matchedSongs.slice(0, 8);
  };

  const savePlaylist = async (playlistData: AIPlaylistData) => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) {
        toast.error("Please login first!");
        return;
      }

      const { error } = await supabaseClient.from("playlists").insert({
        name: playlistData.name,
        user_id: session.user.id,
      });

      if (error) throw error;
      toast.success("Playlist saved successfully! 🎵");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save playlist!");
    }
  };

  const resetPlaylist = () => setPlaylist(null);

  return {
    isGenerating,
    playlist,
    generatePlaylist,
    savePlaylist,
    resetPlaylist,
    setPlaylist,
  };
};

export default useAIPlaylist;