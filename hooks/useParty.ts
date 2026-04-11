import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useParty = (roomId: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.emit("join_room", roomId);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const playSong = (songId: string, time: number) => {
    socketRef.current?.emit("play_song", { roomId, songId, time });
  };

  const pauseSong = (time: number) => {
    socketRef.current?.emit("pause_song", { roomId, time });
  };

  return { socket: socketRef.current, playSong, pauseSong };
};