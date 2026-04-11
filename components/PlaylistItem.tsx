'use client';

import { useGetSongsByPlaylistId } from '@/hooks/useGetSongsByPlaylistId';
import { usePlayer } from '@/hooks/usePlayer';

interface PlaylistItemProps {
  playlist: any;
  isOpen: boolean;
  onToggle: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({
  playlist,
  isOpen,
  onToggle
}) => {
  const songs = useGetSongsByPlaylistId(playlist.id);
  const player = usePlayer();

  const handlePlay = (id: string) => {
    player.setId(id);
    player.setIds([id]);
  };

  return (
    <div className="mb-4">

      {/* PLAYLIST NAME */}
      <div
        onClick={onToggle}
        className="cursor-pointer hover:text-green-400"
      >
        🎵 {playlist.name}
      </div>

      {/* SONGS */}
      {isOpen && (
        <div className="ml-6 mt-2">
          {songs.length === 0 ? (
            <p className="text-neutral-400 text-sm">
              No songs in this playlist
            </p>
          ) : (
            songs.map((song) => (
              <div
                key={song.id}
                onClick={() => handlePlay(song.id)}
                className="cursor-pointer hover:text-green-400"
              >
                🎶 {song.title}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistItem;