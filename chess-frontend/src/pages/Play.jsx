import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket";

const Play = () => {
  const [players, setPlayers] = useState([]);
  let [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");
  const side = searchParams.get("side");

  useEffect(() => {
    if (roomId) {
      socket.emit("getUsers", roomId, (response) => {
        if (response.success) {
          setPlayers(response.players);
        } else {
          console.error("Failed to fetch users:", response.message);
        }
      });
    }
    socket.on("userconnected", (response) => {
      console.log("Another Player Joins the Game");
      setPlayers(response.players);
    });

    return () => {
      socket.off("userconnected");
      socket.off("makemove");
    };
  }, [roomId]);

  return (
    <div className="h-screen w-full px-6 py-3">
      <Board side={side} roomId={roomId} players={players} />
    </div>
  );
};

export default Play;
