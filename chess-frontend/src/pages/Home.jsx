import NewGame from "../components/NewGame";

const Home = () => {
  return (
    <main className="w-full min-h-screen flex justify-between">
      <section className="w-full p-6">
        <NewGame />
      </section>
    </main>
  );
};

export default Home;
