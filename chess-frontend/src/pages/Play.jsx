import React, { useEffect, useState } from "react";
import Board from "../components/Board";
import { useSearchParams } from "react-router-dom";
import { socket } from "../socket";

const Play = () => {
  const [players, setPlayers] = useState([]);
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  let [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId");

  useEffect(() => {
    socket.emit("create_room", roomId, "Guest", (response) => {
      if (response.success) {
        setData(response);
        console.log("Created Room", response);
      } else {
        setError(response.message);
      }
    });

    socket.emit("getUsers", roomId, (response) => {
      if (response.success) {
        setPlayers(response.players);
      } else {
        console.error("Failed to fetch users:", response.message);
      }
    });

    socket.on("userconnected", (response) => {
      setPlayers(response.players);
    });

    return () => {
      socket.off("userconnected");
      socket.off("makemove");
    };
  }, [roomId]);

  console.log("Global players: ", players);

  if (players.length < 2) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="h-[25rem] w-[25rem] border shadow flex items-center justify-center bg-gray-200 flex-col gap-4">
          <p className="text-lg font-medium">
            Waiting fot Other Player ToJoin the game
          </p>
          <a
            href={`http://localhost:5173/play?roomId=${roomId}`}
            className="hover:scale-110 transition text-purple-600 font-semibold underline text-xl"
          >
            Share This Url With Your Friends
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full px-6 py-3">
      {error === "" ? (
        <Board
          side={data?.side}
          roomId={data?.roomId}
          players={players}
          key={data?.roomId + data?.side}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Play;
