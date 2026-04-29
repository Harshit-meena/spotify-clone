"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Loader2, Check, Trash2 } from "lucide-react";
import useUserProfile from "@/hooks/useUserProfile";
import toast from "react-hot-toast";

export default function EditProfilePage() {
  const router = useRouter();
  const { profile, isLoading, isUpdating, updateProfile } = useUserProfile();

  const [displayName,   setDisplayName]   = useState("");
  const [avatarFile,    setAvatarFile]    = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isDragging,    setIsDragging]    = useState(false);
  const [removePhoto,   setRemovePhoto]   = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ FIX 1: useState ki jagah useEffect use karo
  useEffect(() => {
    if (profile?.full_name && displayName === "") {
      setDisplayName(profile.full_name);
    }
  }, [profile?.full_name]);

  // ✅ FIX 2: Direct render mein state set karna hata diya

  // Handle file select
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB!");
      return;
    }

    setAvatarFile(file);
    setRemovePhoto(false);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemovePhoto = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemovePhoto(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const currentAvatar = avatarPreview || (removePhoto ? null : profile?.avatar_url);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      toast.error("Display name cannot be empty!");
      return;
    }
    const fileToUpload = removePhoto ? null : (avatarFile || null);
    const success      = await updateProfile(displayName.trim(), fileToUpload);
    if (success) {
      router.push("/profile");
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          <p className="text-white/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  // ─── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="h-full bg-black overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 bg-white/10 hover:bg-white/20
              rounded-full flex items-center justify-center transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <h1 className="text-white text-xl font-bold">Edit Profile</h1>

          <button
            onClick={handleSave}
            disabled={isUpdating}
            className="bg-green-500 hover:bg-green-400 text-black font-bold
              px-6 py-2 rounded-full transition disabled:opacity-50
              disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Save
              </>
            )}
          </button>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-10">

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            id="avatar-input"
          />

          {/* Avatar with Drag & Drop */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative group"
          >
            {/* Avatar Circle */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className={`relative w-36 h-36 rounded-full overflow-hidden
                cursor-pointer border-4 transition-all duration-300
                ${isDragging
                  ? "border-green-500 scale-105"
                  : "border-transparent group-hover:border-white/30"
                }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {currentAvatar ? (
                <Image
                  src={currentAvatar}
                  alt="Profile"
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-green-500">
                  <span className="text-black text-5xl font-black">
                    {getInitials(displayName || profile?.full_name)}
                  </span>
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0
                group-hover:opacity-100 transition-opacity
                flex flex-col items-center justify-center gap-2"
              >
                <Camera className="w-8 h-8 text-white" />
                <span className="text-white text-xs font-semibold">Change Photo</span>
              </div>

              {/* Drag Overlay */}
              {isDragging && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
                  <p className="text-white text-sm font-bold">Drop here!</p>
                </div>
              )}
            </motion.div>

            {/* New Photo Badge */}
            <AnimatePresence>
              {avatarPreview && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500
                    rounded-full flex items-center justify-center shadow-lg"
                >
                  <Check className="w-4 h-4 text-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <label
              htmlFor="avatar-input"
              className="cursor-pointer bg-white/10 hover:bg-white/20
                text-white text-sm font-semibold px-5 py-2
                rounded-full transition flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Change Photo
            </label>

            {(currentAvatar || avatarFile) && (
              <button
                onClick={handleRemovePhoto}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400
                  text-sm font-semibold px-5 py-2 rounded-full transition
                  flex items-center gap-2 border border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>

          {/* Hint */}
          <p className="text-white/30 text-xs mt-2">or drag & drop an image</p>

          {/* Selected File Info */}
          <AnimatePresence>
            {avatarFile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-green-500/10 border border-green-500/20
                  rounded-xl px-4 py-2 flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">
                  {avatarFile.name} selected
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={50}
            className="w-full bg-white/5 border border-white/10 text-white
              rounded-xl px-5 py-4 text-base focus:outline-none
              focus:border-green-500 focus:ring-2 focus:ring-green-500/20
              transition placeholder:text-white/30"
            placeholder="Your display name..."
          />
          <div className="flex justify-between mt-2">
            <p className="text-white/30 text-xs">This is how others will see you</p>
            <p className="text-white/30 text-xs">{displayName.length}/50</p>
          </div>
        </div>

        {/* Email */}
        <div className="mb-8">
          <label className="block text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">
            Email
          </label>
          <div className="w-full bg-white/5 border border-white/5 text-white/40
            rounded-xl px-5 py-4 text-base cursor-not-allowed"
          >
            {profile?.email || "Not available"}
          </div>
          <p className="text-white/20 text-xs mt-2">Email cannot be changed</p>
        </div>

        {/* Save Button Bottom */}
        <button
          onClick={handleSave}
          disabled={isUpdating || !displayName.trim()}
          className="w-full bg-green-500 hover:bg-green-400 text-black font-black
            py-4 rounded-2xl text-lg transition disabled:opacity-40
            disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>

      </div>
    </div>
  );
}