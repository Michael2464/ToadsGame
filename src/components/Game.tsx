import { useState, useEffect } from "react";
import GameBoard from "./GameBoard";
import MoveCounter from "./MoveCounter";
import Timer from "./Timer";
import HighScores from "./HighScores.tsx";
import WinScreen from "./WinScreen";

interface Frog {
  color: "red" | "blue";
  direction: "left" | "right";
  position: number;
}

interface HighScore {
  moves: number;
  time: number;
  date: string;
}

const Game: React.FC = () => {
  const initialFrogs: Frog[] = [
    { color: "red", direction: "right", position: 0 },
    { color: "red", direction: "right", position: 1 },
    { color: "red", direction: "right", position: 2 },
    { color: "blue", direction: "left", position: 4 },
    { color: "blue", direction: "left", position: 5 },
    { color: "blue", direction: "left", position: 6 },
  ];

  const [frogs, setFrogs] = useState<Frog[]>(initialFrogs);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    const saved = localStorage.getItem("highScores");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isGameWon) {
        setTime((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameWon]);

  useEffect(() => {
    const isWon =
      frogs.filter((f) => f.color === "red").every((f) => f.position > 3) &&
      frogs.filter((f) => f.color === "blue").every((f) => f.position < 3);
    if (isWon) {
      setIsGameWon(true);
      const newScore: HighScore = {
        moves,
        time,
        date: new Date().toLocaleString(),
      };
      const updatedScores = [...highScores, newScore]
        .sort((a, b) => a.moves - b.moves || a.time - b.time)
        .slice(0, 5);
      setHighScores(updatedScores);
      localStorage.setItem("highScores", JSON.stringify(updatedScores));
    }
  }, [frogs]);

  const handleFrogClick = (index: number) => {
    const frog = frogs[index];
    const newFrogs = [...frogs];
    let newPosition: number | null = null;

    if (frog.direction === "right") {
      if (!frogs.some((f) => f.position === frog.position + 1)) {
        newPosition = frog.position + 1;
      } else if (
        !frogs.some((f) => f.position === frog.position + 2) &&
        frog.position + 2 <= 6
      ) {
        newPosition = frog.position + 2;
      }
    } else {
      if (!frogs.some((f) => f.position === frog.position - 1)) {
        newPosition = frog.position - 1;
      } else if (
        !frogs.some((f) => f.position === frog.position - 2) &&
        frog.position - 2 >= 0
      ) {
        newPosition = frog.position - 2;
      }
    }

    if (newPosition !== null) {
      newFrogs[index] = { ...frog, position: newPosition };
      setFrogs(newFrogs);
      setMoves((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setFrogs(initialFrogs);
    setMoves(0);
    setTime(0);
    setIsGameWon(false);
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Жабы (Игра)</h1>
      <div className="flex justify-center space-x-4 mb-4">
        <MoveCounter moves={moves} />
        <Timer time={time} />
      </div>
      <GameBoard frogs={frogs} onFrogClick={handleFrogClick} />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={handleRestart}
      >
        REINICIAR
      </button>
      <HighScores scores={highScores} />
      {isGameWon && (
        <WinScreen moves={moves} time={time} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Game;
