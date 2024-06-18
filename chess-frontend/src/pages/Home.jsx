import { useEffect, useState } from "react";
import NewGame from "../components/NewGame";
import { socket } from "../socket";

const Home = () => {
  const [onlinePlayers, setOnlinePlayers] = useState(0);

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
      <section>
        <h1 className="text-3xl font-bold font-sans">Welcome to Chessify</h1>
        <p>Players Online: {onlinePlayers}</p>
      </section>
      <section className="w-full">
        <NewGame />
      </section>
    </main>
  );
};

export default Home;
