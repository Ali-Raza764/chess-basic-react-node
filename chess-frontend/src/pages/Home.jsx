import { useEffect, useState } from "react";
import { socket } from "../socket";
import CreateGame from "../components/CreateGame";
import PLayWithFriend from "../components/PLayWithFriend";

const Home = () => {
  const [onlinePlayers, setOnlinePlayers] = useState(0);
  const timeFormats = [
    {
      id: 1,
      type: "blitz",
      seconds: 180, // 3 minutes
    },
    {
      id: 2,
      type: "blitz",
      seconds: 300, // 5 minutes
    },
    {
      id: 3,
      type: "rapid",
      seconds: 600, // 10 minutes
    },
    {
      id: 4,
      type: "rapid",
      seconds: 1200, // 20 minutes
    },
    {
      id: 5,
      type: "classical",
      seconds: 1800, // 30 minutes
    },
  ];

  useEffect(() => {
    socket.on("updateOnlinePlayers", (onlinePlayers) => {
      setOnlinePlayers(onlinePlayers);
    });

    return () => {
      socket.off("updateOnlinePlayers");
    };
  }, []);

  return (
    <main className="w-full min-h-screen p-6 flex flex-col gap-6">
      <section className="w-full">
        <h1 className="text-3xl font-bold font-sans">Welcome to Chessify</h1>
        <p>Players Online: {onlinePlayers}</p>
      </section>
      <section className="w-full flex gap-6 items-center justify-center flex-wrap">
        {timeFormats.map((format) => {
          return (
            <CreateGame
              name={format.type}
              seconds={format.seconds}
              key={format.id}
            />
          );
        })}
      </section>
      <section className="w-full p-3">
        <PLayWithFriend timeFormats={timeFormats} />
      </section>
    </main>
  );
};

export default Home;
