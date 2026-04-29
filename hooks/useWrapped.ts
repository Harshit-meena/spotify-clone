import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface TopSong {
  id: string;
  title: string;
  artist: string;
  image_path: string;
  playCount: number;
}

interface TopArtist {
  name: string;
  playCount: number;
}

interface TopGenre {
  name: string;
  percentage: number;
}

interface FirstSong {
  title: string;
  artist: string;
  date: string;
}

interface YearInNumbers {
  differentArtists: number;
  differentSongs: number;
  longestSession: number;
}

export interface WrappedData {
  totalMinutes: number;
  totalSongs: number;
  topSongs: TopSong[];
  topArtists: TopArtist[];
  topGenres: TopGenre[];
  listeningStreak: number;
  mostActiveDay: string;
  mostActiveTime: string;
  firstSong: FirstSong | null;
  yearInNumbers: YearInNumbers;
}

const useWrapped = (year: number = new Date().getFullYear()) => {
  const { supabaseClient } = useSessionContext();
  const [data, setData] = useState<WrappedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWrappedData = async () => {
      try {
        setIsLoading(true);

        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        if (!session?.user) {
          setIsLoading(false);
          return;
        }

        const userId = session.user.id;
        const yearStart = `${year}-01-01T00:00:00Z`;
        const yearEnd = `${year}-12-31T23:59:59Z`;

        const { data: history, error: historyError } =
          await supabaseClient
            .from("listening_history")
            .select(`
              *,
              songs (
                id,
                title,
                author,
                image_path,
                genre
              )
            `)
            .eq("user_id", userId)
            .gte("played_at", yearStart)
            .lte("played_at", yearEnd)
            .order("played_at", { ascending: true });

        if (historyError) throw historyError;

        if (!history || history.length === 0) {
          setData(null);
          setIsLoading(false);
          return;
        }

        // 1. Total Minutes
        const totalSeconds = history.reduce(
          (acc: number, h: any) => acc + (h.duration_listened || 0),
          0
        );
        const totalMinutes = Math.floor(totalSeconds / 60);

        // 2. Top Songs
        const songPlayCount: Record<string, TopSong> = {};
        history.forEach((h: any) => {
          if (!h.songs) return;
          const songId = h.songs.id;
          if (!songPlayCount[songId]) {
            songPlayCount[songId] = {
              id: songId,
              title: h.songs.title || "Unknown",
              artist: h.songs.author || "Unknown",
              image_path: h.songs.image_path || "",
              playCount: 0,
            };
          }
          songPlayCount[songId].playCount++;
        });

        const topSongs = Object.values(songPlayCount)
          .sort((a, b) => b.playCount - a.playCount)
          .slice(0, 5);

        // 3. Top Artists
        const artistPlayCount: Record<string, number> = {};
        history.forEach((h: any) => {
          if (!h.songs?.author) return;
          const artist = h.songs.author;
          artistPlayCount[artist] = (artistPlayCount[artist] || 0) + 1;
        });

        const topArtists: TopArtist[] = Object.entries(artistPlayCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, playCount]) => ({ name, playCount }));

        // 4. Top Genres
        const genreCount: Record<string, number> = {};
        history.forEach((h: any) => {
          if (!h.songs?.genre) return;
          const genre = h.songs.genre;
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        });

        const totalGenrePlays = Object.values(genreCount).reduce(
          (a, b) => a + b,
          0
        );

        const topGenres: TopGenre[] = Object.entries(genreCount)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalGenrePlays) * 100),
          }));

        // 5. Most Active Day
        const dayCount: Record<string, number> = {};
        history.forEach((h: any) => {
          const day = new Date(h.played_at).toLocaleDateString("en-US", {
            weekday: "long",
          });
          dayCount[day] = (dayCount[day] || 0) + 1;
        });

        const mostActiveDay =
          Object.entries(dayCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          "Friday";

        // 6. Most Active Time
        const hourCount: Record<string, number> = {};
        history.forEach((h: any) => {
          const hour = new Date(h.played_at).getHours();
          let timeSlot = "Night";
          if (hour >= 5 && hour < 12) timeSlot = "Morning";
          else if (hour >= 12 && hour < 17) timeSlot = "Afternoon";
          else if (hour >= 17 && hour < 21) timeSlot = "Evening";
          hourCount[timeSlot] = (hourCount[timeSlot] || 0) + 1;
        });

        const mostActiveTime =
          Object.entries(hourCount).sort(([, a], [, b]) => b - a)[0]?.[0] ||
          "Night";

        // 7. First Song
        const firstPlay = history[0];
        const firstSong: FirstSong | null = firstPlay?.songs
          ? {
              title: firstPlay.songs.title || "Unknown",
              artist: firstPlay.songs.author || "Unknown",
              date: new Date(firstPlay.played_at).toLocaleDateString(),
            }
          : null;

        // 8. Listening Streak
        const dates = [
          ...new Set(
            history.map((h: any) =>
              new Date(h.played_at).toISOString().split("T")[0]
            )
          ),
        ].sort() as string[];

        let streak = 1;
        let maxStreak = 1;

        for (let i = 1; i < dates.length; i++) {
          const diff =
            (new Date(dates[i]).getTime() -
              new Date(dates[i - 1]).getTime()) /
            (1000 * 60 * 60 * 24);

          if (diff === 1) {
            streak++;
            maxStreak = Math.max(maxStreak, streak);
          } else {
            streak = 1;
          }
        }

        // 9. Longest Session
        const longestSession = Math.max(
          ...history.map((h: any) => h.duration_listened || 0)
        );

        setData({
          totalMinutes,
          totalSongs: history.length,
          topSongs,
          topArtists,
          topGenres,
          listeningStreak: maxStreak,
          mostActiveDay,
          mostActiveTime,
          firstSong,
          yearInNumbers: {
            differentArtists: Object.keys(artistPlayCount).length,
            differentSongs: Object.keys(songPlayCount).length,
            longestSession,
          },
        });
      } catch (err: any) {
        console.error("Wrapped Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWrappedData();
  }, [year, supabaseClient]);

  return { data, isLoading, error };
};

export default useWrapped;