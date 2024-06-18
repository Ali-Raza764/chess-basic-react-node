import React from "react";
import { useNavigate } from "react-router-dom";
import { RxLightningBolt } from "react-icons/rx";
import { FaClock } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";

const CreateGame = ({ name, seconds }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const roomId = parseInt(Math.random() * 2000241210 * Math.random());
    navigate(`/play?roomId=${roomId}&time=${seconds}`);
  };

  // Determine which icon to display based on the game type (name)
  const renderIcon = () => {
    switch (name) {
      case "blitz":
        return <RxLightningBolt className="w-8 h-8" />;
      case "rapid":
        return <FaClock className="w-8 h-8" />;
      case "classical":
        return <FaGraduationCap className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <button
      className="h-32 w-32 border shadow rounded-md p-2 bg-gray-900 hover:bg-gray-800 transition text-white text-lg font-semibold flex flex-col items-center justify-center gap-6"
      onClick={handleClick}
      style={{ backdropFilter: "brightness(0.8) saturate(120%)", zIndex: 10 }}
    >
      <span className="flex items-center gap-3 text-xl">
        {renderIcon()} {/* Display the appropriate icon */}
        {name}
      </span>
      <span className="text-4xl font-bold w-full flex gap-3 items-center justify-center">
        {seconds / 60}+
      </span>
    </button>
  );
};

export default CreateGame;
