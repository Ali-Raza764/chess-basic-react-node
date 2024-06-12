import { useRef, useState, useEffect } from "react";
import { Chess } from "chess.js"; // Importing the Chess class
import { Chessboard } from "react-chessboard";
import {
  capturePieceSound,
  SimpleMoveSound,
  PromotionSound,
  CheckSound,
  CheckmateSound,
  CastlingSound,
} from "../assets/sounds";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export default function Board({ side, roomId, move }) {
  const audioRef = useRef(null);
  const [currentSound, setCurrentSound] = useState(null);
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  // const [position, setPosition] = useState("");

  useEffect(() => {
    try {
      game.move(move);
      setGame(new Chess(game.fen()));
      controlSounds(move);
    } catch (error) {
      return;
    }
  }, [move]);

  const makeMove = (sourceSquare, targetSquare, piece) => {
    //* We have to stop the player from movuing opponent pieces so we check the side of the user and the piece they moved
    //* The piece notaion is like wq, bq etc. We can split it to check the first part w or b for white and black
    const movedPiceColor = piece[0]?.toLowerCase();
    if (movedPiceColor === "w" && side === "black") {
      // if the piece is white and the user is black then donot accept the move
      console.log(movedPiceColor, side);
      return null;
    } else if (movedPiceColor === "b" && side === "white") {
      // if the piece is black and the user is white then donot accept the move
      return null;
    }
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() || "q",
    });

    if (move) {
      socket.emit("move", move, roomId);
    }

    return move;
  };

  function onDrop(sourceSquare, targetSquare, piece) {
    const move = makeMove(sourceSquare, targetSquare, piece);

    if (move === null) return "Invalid Move";

    controlSounds(move);
    return true;
  }

  const controlSounds = (move) => {
    if (game.isCheckmate()) {
      playSound(CheckmateSound);
    } else if (game.isCheck() && !game.isCheckmate()) {
      playSound(CheckSound);
    } else if (move.captured) {
      playSound(capturePieceSound);
    } else if (move.promotion) {
      playSound(PromotionSound);
    } else if (move.san === "O-O") {
      playSound(CastlingSound);
    } else {
      playSound(SimpleMoveSound);
    }
  };

  const playSound = (sound) => {
    setCurrentSound(sound);
    if (audioRef.current.readyState >= 2) {
      audioRef.current.play();
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center">
      <audio ref={audioRef} src={currentSound} preload="auto" autoPlay />
      <Chessboard
        id="PlayVsRandom"
        position={game.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
        }}
        boardWidth={600}
        boardOrientation={side}
        // getPositionObject={(position) => {
        //   setPosition(position);
        // }}
      />
    </section>
  );
}
