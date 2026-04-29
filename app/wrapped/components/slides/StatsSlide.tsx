"use client";

import { motion, Variants } from "framer-motion";

interface Props {
  streak?: number;
  activeDay?: string;
  activeTime?: string;
  firstSong?: {
    title: string;
    artist: string;
    date: string;
  } | null;
}

const statVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      type: "spring" as const,
    },
  }),
};

const timeEmojis: Record<string, string> = {
  Morning: "🌅",
  Afternoon: "☀️",
  Evening: "🌆",
  Night: "🌙",
};

const dayEmojis: Record<string, string> = {
  Monday: "😤",
  Tuesday: "💪",
  Wednesday: "🎯",
  Thursday: "🎶",
  Friday: "🔥",
  Saturday: "🎉",
  Sunday: "😌",
};

const StatsSlide = ({
  streak = 0,
  activeDay = "Friday",
  activeTime = "Night",
  firstSong = null,
}: Props) => {
  const stats = [
    {
      icon: "🔥",
      label: "Longest Streak",
      value: `${streak} days`,
      description: "consecutive days of listening",
      color: "from-orange-500/20 to-red-500/20",
      border: "border-orange-500/30",
    },
    {
      icon: dayEmojis[activeDay] || "📅",
      label: "Most Active Day",
      value: activeDay,
      description: "you listen the most on this day",
      color: "from-blue-500/20 to-cyan-500/20",
      border: "border-blue-500/30",
    },
    {
      icon: timeEmojis[activeTime] || "⏰",
      label: "Favorite Time",
      value: activeTime,
      description: "your peak listening time",
      color: "from-purple-500/20 to-violet-500/20",
      border: "border-purple-500/30",
    },
  ];

  return (
    <div
      className="h-full w-full bg-gradient-to-b 
      from-teal-700 to-cyan-900 flex flex-col p-8 pt-16"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-white/70 text-lg">Fun facts about you</p>
        <h2 className="text-white text-4xl font-black">
          Your Stats 📊
        </h2>
      </motion.div>

      {/* Stats Cards */}
      <div className="flex flex-col gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            custom={index}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className={`bg-gradient-to-r ${stat.color} 
              border ${stat.border} rounded-2xl p-4
              backdrop-blur`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{stat.icon}</span>
              <div className="flex-1">
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-white text-2xl font-black">
                  {stat.value}
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  {stat.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* First Song of Year */}
      {firstSong && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-4 bg-white/10 backdrop-blur rounded-2xl p-4"
        >
          <p className="text-white/60 text-sm mb-1">
            🎵 First song you played this year
          </p>
          <p className="text-white font-bold truncate">
            {firstSong.title}
          </p>
          <p className="text-white/60 text-sm">
            {firstSong.artist} • {firstSong.date}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default StatsSlide;