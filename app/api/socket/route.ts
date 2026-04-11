// import { Server } from "socket.io";

// let io: Server;

// export async function GET() {
//   if (!io) {
//     io = new Server({
//       cors: { origin: "*" },
//     });

//     io.on("connection", (socket) => {
//       console.log("User connected:", socket.id);

//       socket.on("join_room", (roomId) => {
//         socket.join(roomId);
//         console.log("Joined room:", roomId);
//       });

//       socket.on("play_song", (data) => {
//         console.log("PLAY EVENT", data);
//         socket.to(data.roomId).emit("sync_song", data);
//       });

//       socket.on("pause_song", (data) => {
//         console.log("PAUSE EVENT", data);
//         socket.to(data.roomId).emit("pause_song", data);
//       });
//     });
//   }

//   return new Response("Socket server running");
// }