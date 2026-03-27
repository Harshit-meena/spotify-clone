import { Song } from "@/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const useLoadImage = (song: Song) => {
  const supabase = createClientComponentClient();

  if (!song?.image_path) {
    return "/images/liked.png"; // fallback image 🔥
  }

  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return data.publicUrl;
};