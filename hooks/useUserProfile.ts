import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import toast from "react-hot-toast";

interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

const useUserProfile = () => {
  const { supabaseClient } = useSessionContext();
  const [profile, setProfile]     = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) return;

      const { data, error } = await supabaseClient
        .from("users")
        .select("id, full_name, avatar_url, email")
        .eq("id", session.user.id)
        .single();

      if (error) {
        // User row nahi hai to insert karo
        if (error.code === "PGRST116") {
          await supabaseClient.from("users").insert({
            id:        session.user.id,
            email:     session.user.email,
            full_name: session.user.user_metadata?.full_name || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
          });
          await fetchProfile();
          return;
        }
        throw error;
      }

      setProfile(data);
    } catch (err: any) {
      console.error("Profile fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Upload avatar image
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) return null;

      // File validation
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file!");
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB!");
        return null;
      }

      const userId    = session.user.id;
      const fileExt   = file.name.split(".").pop();
      const fileName  = `${userId}/avatar.${fileExt}`;

      // Old avatar delete karo
      await supabaseClient.storage
        .from("avatars")
        .remove([`${userId}/avatar.jpg`,
                 `${userId}/avatar.jpeg`,
                 `${userId}/avatar.png`,
                 `${userId}/avatar.webp`]);

      // New avatar upload karo
      const { data, error } = await supabaseClient.storage
        .from("avatars")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) throw error;

      // Public URL get karo
      const { data: urlData } = supabaseClient.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Cache busting ke liye timestamp add karo
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      return publicUrl;
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error("Failed to upload image!");
      return null;
    }
  };

  // Update profile
  const updateProfile = async (
    fullName: string,
    avatarFile?: File | null
  ) => {
    try {
      setIsUpdating(true);

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      if (!session?.user) return false;

      let avatarUrl = profile?.avatar_url || null;

      // Agar new image hai to upload karo
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }

      // Database update karo
      const { error: dbError } = await supabaseClient
        .from("users")
        .update({
          full_name:  fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", session.user.id);

      if (dbError) throw dbError;

      // Auth metadata bhi update karo
      await supabaseClient.auth.updateUser({
        data: {
          full_name:  fullName,
          avatar_url: avatarUrl,
        },
      });

      // Local state update karo
      setProfile((prev) =>
        prev ? { ...prev, full_name: fullName, avatar_url: avatarUrl } : null
      );

      toast.success("Profile updated successfully! 🎉");
      return true;
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile!");
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  };
};

export default useUserProfile;