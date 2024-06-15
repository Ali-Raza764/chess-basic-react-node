import { useRef, useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import {
  capturePieceSound,
  SimpleMoveSound,
  PromotionSound,
  CheckSound,
  CheckmateSound,
  CastlingSound,
} from "../../assets/sounds";
import { socket } from "../../socket";

// Other Components
import PreviousMoves from "./PreviousMoves";
import Users from "./Users";
import GameActions from "./GameActions";

export default function Board({ side, roomId, players }) {
  const audioRef = useRef(null);
  const [currentSound, setCurrentSound] = useState(null);
  const chess = new Chess();
  const [game, setGame] = useState(chess);
  const [moves, setMoves] = useState([]);
  const [gameover, setGameover] = useState(false);
  const isReady = players.length === 2 ? true : false;

  useEffect(() => {
    socket.on("gameover", () => {
      setGameover(true);
    });
    socket.on("makemove", (move) => {
      console.log(move);

      const madeMove = game.move(move);
      setGame(new Chess(game.fen()));
      setMoves([...moves, madeMove]);
      controlSounds(madeMove);
    });
  }, [game]);

  const makeMove = (sourceSquare, targetSquare, piece) => {
    //* We have to stop the player from moving opponent pieces so we check the side of the user and the piece they moved
    //* The piece notaion is like wq, bq etc. We can split it to check the first part w or b for white and black
    const movedPiceColor = piece[0]?.toLowerCase();
    if (movedPiceColor === "w" && side === "black") {
      // if the piece is white and the user is black then donot accept the move
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
      setMoves([...moves, move]);
    }

    return move;
  };

  function onDrop(sourceSquare, targetSquare, piece) {
    if (!isReady) {
      return;
    }
    const move = makeMove(sourceSquare, targetSquare, piece);

    if (move === null) return "Invalid Move";

    controlSounds(move);
    return true;
  }

  const controlSounds = (move) => {
    if (game.isCheckmate()) {
      playSound(CheckmateSound);
    } else if (game.isCheck()) {
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
    <section className="w-full h-full flex items-center">
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
      />
      <div className="h-full w-full">
        <PreviousMoves moves={moves} />
        <Users players={players} />
        {isReady && <GameActions />}
        {gameover && <NewGame />}
      </div>
    </section>
  );
}
