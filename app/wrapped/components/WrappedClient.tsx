"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWrapped from "@/hooks/useWrapped";
import IntroSlide from "./slides/IntroSlide";
import MinutesSlide from "./slides/MinutesSlide";
import TopSongsSlide from "./slides/TopSongsSlide";
import TopArtistsSlide from "./slides/TopArtistsSlide";
import GenreSlide from "./slides/GenreSlide";
import StatsSlide from "./slides/StatsSlide";
import FinalSlide from "./slides/FinalSlide";

type SlideComponent = React.ComponentType<any>;

interface Slide {
  component: SlideComponent;
  props: Record<string, any>;
}

const WrappedClient = () => {
  const { data, isLoading } = useWrapped(2024);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const slides: Slide[] = [
    { component: IntroSlide, props: {} },
    { 
      component: MinutesSlide, 
      props: { minutes: data?.totalMinutes ?? 0 } 
    },
    { 
      component: TopSongsSlide, 
      props: { songs: data?.topSongs ?? [] } 
    },
    { 
      component: TopArtistsSlide, 
      props: { artists: data?.topArtists ?? [] } 
    },
    { 
      component: GenreSlide, 
      props: { genres: data?.topGenres ?? [] } 
    },
    {
      component: StatsSlide,
      props: {
        streak: data?.listeningStreak ?? 0,
        activeDay: data?.mostActiveDay ?? "Friday",
        activeTime: data?.mostActiveTime ?? "Night",
        firstSong: data?.firstSong ?? null,
      },
    },
    { 
      component: FinalSlide, 
      props: { data: data ?? null } 
    },
  ];

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return <WrappedLoadingSkeleton />;
  }

  if (!data) {
    return <NoDataSlide />;
  }

  const CurrentSlide = slides[currentSlide].component;
  const currentProps = slides[currentSlide].props;

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-50 flex gap-1">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
          >
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: index <= currentSlide ? "100%" : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={{
            enter: (dir: number) => ({
              x: dir > 0 ? "100%" : "-100%",
              opacity: 0,
            }),
            center: { 
              x: 0, 
              opacity: 1 
            },
            exit: (dir: number) => ({
              x: dir > 0 ? "-100%" : "100%",
              opacity: 0,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <CurrentSlide {...currentProps} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation - Left/Right Click Areas */}
      <div className="absolute inset-0 flex z-40">
        <div
          className="w-1/3 h-full cursor-pointer"
          onClick={goPrev}
        />
        <div
          className="w-2/3 h-full cursor-pointer"
          onClick={goNext}
        />
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-50">
        <p className="text-white/50 text-sm">
          {currentSlide + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
};

// ---- Sub Components ----

const NoDataSlide = () => (
  <div className="h-full flex flex-col items-center justify-center 
    bg-gradient-to-b from-purple-900 to-black px-8"
  >
    <p className="text-white text-6xl mb-4">😔</p>
    <p className="text-white text-2xl font-bold mb-2">
      Not Enough Data
    </p>
    <p className="text-white/60 text-center">
      Start listening to music to get your Wrapped!
    </p>
  </div>
);

const WrappedLoadingSkeleton = () => (
  <div className="h-full flex items-center justify-center 
    bg-gradient-to-b from-green-900 to-black"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-center"
    >
      <p className="text-white text-3xl font-bold mb-4">🎵</p>
      <p className="text-white text-xl">Loading your Wrapped...</p>
    </motion.div>
  </div>
);

export default WrappedClient;