import React from "react";
import { useNavigate } from "react-router-dom";

const CreateGame = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const roomId = parseInt(Math.random() * 2000241210 * Math.random());
    navigate(`/play?roomId=${roomId}`);
  };

  return (
    <button
      className="h-32 w-32 border shadow rounded-md p-2 bg-gray-900 hover:bg-gray-800 transition text-white text-lg font-semibold"
      onClick={handleClick}
    >
      Create Game +
    </button>
  );
};

export default CreateGame;
