"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface UserAvatarProps {
  size?: number;
  className?: string;
  userId?: string;
}

const UserAvatar = ({
  size = 40,
  className = "",
  userId,
}: UserAvatarProps) => {
  const { supabaseClient } = useSessionContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials]   = useState("U");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const {
          data: { session },
        } = await supabaseClient.auth.getSession();

        const targetId = userId || session?.user?.id;
        if (!targetId) return;

        const { data } = await supabaseClient
          .from("users")
          .select("avatar_url, full_name, email")
          .eq("id", targetId)
          .single();

        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }

        // Set initials
        const name = data?.full_name || data?.email || "User";
        setInitials(name.charAt(0).toUpperCase());

      } catch (err) {
        console.error("Avatar fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatar();
  }, [userId, supabaseClient]);

  if (isLoading) {
    return (
      <div
        className={`rounded-full bg-neutral-700 animate-pulse ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  if (avatarUrl) {
    return (
      <div
        className={`relative rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarUrl}
          alt="Profile"
          fill
          className="object-cover"
          unoptimized
          onError={() => setAvatarUrl(null)}
        />
      </div>
    );
  }

  // Fallback - initials avatar
  return (
    <div
      className={`rounded-full bg-green-500 flex items-center
        justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="text-black font-black"
        style={{ fontSize: size * 0.4 }}
      >
        {initials}
      </span>
    </div>
  );
};

export default UserAvatar;