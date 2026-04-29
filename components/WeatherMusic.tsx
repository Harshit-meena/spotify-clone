'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/hooks/usePlayer';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface WeatherData {
  temp:        number;
  description: string;
  city:        string;
  icon:        string;
  mood:        'rainy' | 'sunny' | 'cloudy' | 'stormy' | 'snowy' | 'windy';
}

const WEATHER_MOODS = {
  rainy:  { emoji: '🌧️', label: 'Rainy Vibes',    color: '#60a5fa', keywords: ['rain', 'drizzle'] },
  sunny:  { emoji: '☀️', label: 'Sunny Feels',    color: '#f59e0b', keywords: ['clear', 'sunny']  },
  cloudy: { emoji: '☁️', label: 'Cloudy Chill',   color: '#9ca3af', keywords: ['cloud', 'overcast'] },
  stormy: { emoji: '⛈️', label: 'Storm Energy',   color: '#7c3aed', keywords: ['thunder', 'storm'] },
  snowy:  { emoji: '❄️', label: 'Winter Calm',    color: '#bfdbfe', keywords: ['snow', 'blizzard'] },
  windy:  { emoji: '💨', label: 'Breezy Beats',   color: '#34d399', keywords: ['wind', 'breezy']  },
};

const WeatherMusic = () => {
  const supabase             = useSupabaseClient();
  const player               = usePlayer();
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [songs, setSongs]       = useState<any[]>([]);
  const [loading, setLoading]   = useState(false);
  const [locError, setLocError] = useState(false);
  const [show, setShow]         = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    getWeatherAndSongs();
  }, []);

  const getMood = (description: string): WeatherData['mood'] => {
    const desc = description.toLowerCase();
    for (const [mood, data] of Object.entries(WEATHER_MOODS)) {
      if (data.keywords.some(k => desc.includes(k))) {
        return mood as WeatherData['mood'];
      }
    }
    return 'cloudy';
  };

  const getWeatherAndSongs = async () => {
    setLoading(true);
    try {
      // Location permission
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
        });
      });

      const { latitude, longitude } = position.coords;

      // OpenWeatherMap API (free)
      const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || 'demo';
      const res     = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        // Demo mode - agar API key nahi hai
        useDemoWeather();
        return;
      }

      const data = await res.json();
      const mood = getMood(data.weather[0].description);

      setWeather({
        temp:        Math.round(data.main.temp),
        description: data.weather[0].description,
        city:        data.name,
        icon:        data.weather[0].icon,
        mood,
      });

      await fetchMoodSongs(mood);
    } catch (err) {
      console.error('Weather error:', err);
      setLocError(true);
      useDemoWeather();
    } finally {
      setLoading(false);
    }
  };

  // Demo weather (agar location ya API key nahi)
  const useDemoWeather = async () => {
    const hour = new Date().getHours();
    let mood: WeatherData['mood'] = 'sunny';

    if (hour >= 20 || hour < 6) mood = 'cloudy';
    else if (hour >= 6 && hour < 12) mood = 'sunny';
    else mood = 'rainy';

    setWeather({
      temp:        28,
      description: 'partly cloudy',
      city:        'Your City',
      icon:        '02d',
      mood,
    });

    await fetchMoodSongs(mood);
  };

  const fetchMoodSongs = async (mood: WeatherData['mood']) => {
    try {
      // Mood ke hisaab se songs fetch karo
      // Teri songs table se genre/mood column ke basis pe
      const { data } = await supabase
        .from('songs')
        .select('*')
        .limit(10);

      if (data) setSongs(data);
    } catch (err) {
      console.error('Songs fetch error:', err);
    }
  };

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    player.setId(songs[0].id);
    player.setIds(songs.map((s: any) => s.id));
  };

  const handlePlaySong = (song: any) => {
    player.setId(song.id);
    player.setIds(songs.map((s: any) => s.id));
  };

  if (!show) return null;

  const moodData = weather ? WEATHER_MOODS[weather.mood] : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="mb-8 rounded-3xl overflow-hidden"
        style={{
          background: moodData
            ? `linear-gradient(135deg, ${moodData.color}20, ${moodData.color}08)`
            : 'var(--bg-glass)',
          border: `1px solid ${moodData ? moodData.color + '30' : 'var(--border-subtle)'}`,
        }}
      >
        {/* Header */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Weather Display */}
              {loading ? (
                <div
                  className="w-12 h-12 rounded-full animate-pulse"
                  style={{ background: 'var(--bg-highlight)' }}
                />
              ) : weather ? (
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{moodData?.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        className="text-lg font-black"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {moodData?.label}
                      </h2>
                      {!locError && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: `${moodData?.color}20`,
                            color: moodData?.color,
                          }}
                        >
                          {weather.temp}°C • {weather.city}
                        </span>
                      )}
                    </div>
                    <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                      {locError
                        ? '📍 Location se music suggest kar raha hoon'
                        : `Bahar ${weather.description} hai - yeh suno!`
                      }
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {/* Play All */}
              {songs.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAll}
                  className="px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5"
                  style={{
                    background: moodData?.color || 'var(--green)',
                    color: '#000',
                  }}
                >
                  ▶ Play All
                </motion.button>
              )}

              {/* Expand */}
              <button
                onClick={() => setExpanded(p => !p)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{
                  background: 'var(--bg-highlight)',
                  color: 'var(--text-muted)',
                }}
              >
                {expanded ? '▲' : '▼'}
              </button>

              {/* Close */}
              <button
                onClick={() => setShow(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--bg-highlight)',
                  color: 'var(--text-muted)',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Song count */}
          {songs.length > 0 && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {songs.length} songs • Weather ke hisaab se curated
            </p>
          )}
        </div>

        {/* Songs List */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className="mx-4 mb-4 rounded-2xl overflow-hidden"
                style={{ border: '1px solid var(--border-subtle)' }}
              >
                {songs.length === 0 ? (
                  <p
                    className="p-4 text-sm text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Koi song nahi mila 😢
                  </p>
                ) : (
                  songs.map((song: any, idx: number) => (
                    <motion.div
                      key={song.id}
                      whileHover={{ x: 4 }}
                      onClick={() => handlePlaySong(song)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                      style={{ borderBottom: idx < songs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                      onMouseEnter={e =>
                        (e.currentTarget.style.background = 'var(--bg-glass-hover)')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      {/* Number */}
                      <span
                        className="w-5 text-center text-xs font-bold flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {idx + 1}
                      </span>

                      {/* Image */}
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        {song.image_path ? (
                          <img
                            src={song.image_path}
                            alt={song.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: 'var(--bg-highlight)' }}
                          >
                            <span>{moodData?.emoji}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {song.title}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {song.author}
                        </p>
                      </div>

                      {/* Play icon */}
                      <span style={{ color: moodData?.color || 'var(--green)' }}>▶</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default WeatherMusic;