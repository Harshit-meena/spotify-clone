'use client';

import uniqid from 'uniqid';

import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';

import { useUploadModal } from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';

import { Modal } from './Modal';
import Input from './Input';
import { Button } from './Button';

const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showLyricsField, setShowLyricsField] = useState(false); // ✅ Toggle lyrics field

  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
      lyrics: '',  // ✅ Added
      genre: '',   // ✅ Added
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setShowLyricsField(false); // ✅ Reset lyrics toggle
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile  = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields');
        return;
      }

      const uniqueID = uniqid();

      // Upload song file
      const { data: songData, error: songError } =
        await supabaseClient.storage
          .from('songs')
          .upload(`song-${values.title}-${uniqueID}`, songFile);

      if (songError) {
        toast.error('Failed song upload.');
        return;
      }

      // Upload image file
      const { data: imageData, error: imageError } =
        await supabaseClient.storage
          .from('images')
          .upload(`image-${values.title}-${uniqueID}`, imageFile);

      if (imageError) {
        toast.error('Failed image upload.');
        return;
      }

      // Insert into database
      const { error: supabaseError } = await supabaseClient
        .from('songs')
        .insert({
          user_id:    user.id,
          title:      values.title,
          author:     values.author,
          image_path: imageData.path,
          song_path:  songData.path,
          lyrics:     values.lyrics?.trim() || null,  // ✅ Added
          genre:      values.genre?.trim() || null,   // ✅ Added
        });

      if (supabaseError) {
        toast.error(supabaseError.message);
        return;
      }

      toast.success('Song uploaded successfully!');
      router.refresh();
      reset();
      setShowLyricsField(false);
      uploadModal.onClose();

    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >

        {/* Song Title */}
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />

        {/* Song Author */}
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />

        {/* Genre - ✅ New Field */}
        <Input
          id="genre"
          disabled={isLoading}
          {...register('genre')}
          placeholder="Genre (e.g. Pop, Rock, Bollywood)"
        />

        {/* Song File */}
        <div>
          <div className="pb-1 text-sm text-neutral-400">
            Select a song file
          </div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>

        {/* Image File */}
        <div>
          <div className="pb-1 text-sm text-neutral-400">
            Select a cover image
          </div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>

        {/* Lyrics Toggle Button - ✅ New */}
        <button
          type="button"
          onClick={() => setShowLyricsField(!showLyricsField)}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-medium
            text-neutral-400 hover:text-white transition-colors
            disabled:opacity-50 text-left"
        >
          <span
            className={`w-4 h-4 rounded border flex items-center 
              justify-center transition-colors flex-shrink-0
              ${showLyricsField
                ? 'bg-green-500 border-green-500'
                : 'border-neutral-500'
              }`}
          >
            {showLyricsField && (
              <svg
                className="w-3 h-3 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
          Add Lyrics (Optional)
        </button>

        {/* Lyrics Textarea - ✅ New */}
        {showLyricsField && (
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="lyrics"
                className="text-sm text-neutral-400"
              >
                Song Lyrics
              </label>
              <span className="text-xs text-neutral-500">
                One line per line
              </span>
            </div>

            <textarea
              id="lyrics"
              disabled={isLoading}
              placeholder={`Paste lyrics here...\n\nExample:\nFirst line of the song\nSecond line here\nThird line of lyrics`}
              rows={8}
              {...register('lyrics')}
              className="w-full rounded-md px-3 py-2 text-sm
                bg-neutral-700/50 border border-neutral-600
                text-white placeholder:text-neutral-500
                focus:outline-none focus:border-green-500
                resize-none transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Lyrics Help */}
            <div className="bg-neutral-800/50 rounded-lg p-3 border border-neutral-700">
              <p className="text-xs text-neutral-400 leading-relaxed">
                💡 <strong className="text-neutral-300">Tip:</strong>{" "}
                Search on Google:{" "}
                <span className="text-green-400 font-mono">
                  "song name artist lyrics"
                </span>{" "}
                and paste them here for real-time sync while playing.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          disabled={isLoading}
          type="submit"
          className="mt-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Song'
          )}
        </Button>

      </form>
    </Modal>
  );
};

export default UploadModal;