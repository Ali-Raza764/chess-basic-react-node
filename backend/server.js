const io = require("socket.io")(8000, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const rooms = {}; // Assuming you have this global object to keep track of rooms

io.on("connection", (socket) => {
  socket.on("create_room", (roomId, callback) => {
    // Check if the room already exists and is full
    if (rooms[roomId] && rooms[roomId].players.length === 2) {
      callback({ success: false, message: "Room is full" });
      return;
    }

    // If the room doesn't exist, create it
    if (!rooms[roomId]) {
      rooms[roomId] = { players: [] };
    }

    // Assign side to the joining player
    const assignedSide = rooms[roomId].players.length === 0 ? "white" : "black";
    rooms[roomId].players.push({ id: socket.id, side: assignedSide });

    // Join the room
    socket.join(roomId);

    // Send success callback with room ID, assigned side, and number of users in the room
    callback({
      success: true,
      roomId: roomId,
      side: assignedSide,
      usersInRoom: rooms[roomId].players.length,
    });

    socket.to(roomId).emit("userconnected", {
      users: rooms[roomId].players.length,
    });
  });

  socket.on("move", (move, roomId) => {
    console.log(move, roomId);
    socket.to(roomId).emit("makemove", move);
  });

  socket.on("disconnect", () => {
    // Find the room the user is in and remove them from it
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(
        (player) => player.id === socket.id
      );
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        // Trigger event for user leaving the room
        io.to(roomId).emit("user_left", { id: socket.id });
        // If the room is empty, delete it
        if (room.players.length === 0) {
          delete rooms[roomId];
        }
        break;
      }
    }
  });
});
