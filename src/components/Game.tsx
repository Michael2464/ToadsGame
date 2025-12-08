import { useState, useEffect, useRef } from "react";
import GameBoard from "./GameBoard";
import MoveCounter from "./MoveCounter";
import Timer from "./Timer";
import HighScores from "./HighScores.tsx";
import WinScreen from "./WinScreen";
import StartScreen from "./StartScreen";

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
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingFrogIndex, setAnimatingFrogIndex] = useState<number | null>(
    null
  );
  const [animatingFromPosition, setAnimatingFromPosition] = useState<
    number | null
  >(null);
  const [animatingToPosition, setAnimatingToPosition] = useState<number | null>(
    null
  );
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const [highScores, setHighScores] = useState<HighScore[]>(() => {
    const saved = localStorage.getItem("highScores");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    soundRef.current = new Audio("./single_frog_croak.mp3");
    soundRef.current.volume = 1.0;
    return () => {
      if (soundRef.current) {
        soundRef.current.play();
        soundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isGameStarted || isGameWon) return;
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameStarted, isGameWon]);

  useEffect(() => {
    const isWon =
      frogs.filter((f) => f.color === "red").every((f) => f.position > 3) &&
      frogs.filter((f) => f.color === "blue").every((f) => f.position < 3) &&
      !frogs.some((f) => f.position === 3);
    if (isWon && !isGameWon) {
      setIsGameWon(true);
      setHighScores((prevScores) => {
        const newScore: HighScore = {
          moves,
          time,
          date: new Date().toLocaleString(),
        };
        const updatedScores = [...prevScores, newScore]
          .sort((a, b) => a.moves - b.moves || a.time - b.time)
          .slice(0, 10);
        localStorage.setItem("highScores", JSON.stringify(updatedScores));
        return updatedScores;
      });
    }
  }, [frogs, isGameWon, moves, time]);

  const handleFrogClick = (index: number) => {
    if (isAnimating || isGameWon || !isGameStarted) return;

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
      setIsAnimating(true);
      setAnimatingFrogIndex(index);
      setAnimatingFromPosition(frog.position);
      setAnimatingToPosition(newPosition);

      // Play sound
      if (soundRef.current) {
        soundRef.current.currentTime = 0;
        soundRef.current.play().catch(() => {});
      }

      // Animate movement
      setTimeout(() => {
        newFrogs[index] = { ...frog, position: newPosition! };
        setFrogs(newFrogs);
        setMoves((prev) => prev + 1);
        setIsAnimating(false);
        setAnimatingFrogIndex(null);
        setAnimatingFromPosition(null);
        setAnimatingToPosition(null);
      }, 300);
    }
  };

  const handleRestart = () => {
    setFrogs(initialFrogs);
    setMoves(0);
    setTime(0);
    setIsGameWon(false);
    setIsAnimating(false);
    setAnimatingFrogIndex(null);
    setAnimatingFromPosition(null);
    setAnimatingToPosition(null);
  };

  const handleBackToMenu = () => {
    setFrogs(initialFrogs);
    setMoves(0);
    setTime(0);
    setIsGameWon(false);
    setIsGameStarted(false);
    setIsAnimating(false);
    setAnimatingFrogIndex(null);
    setAnimatingFromPosition(null);
    setAnimatingToPosition(null);
  };

  const handleStart = () => {
    setIsGameStarted(true);
  };

  return (
    <div className="text-center p-2 sm:p-4">
      {!isGameStarted && <StartScreen onStart={handleStart} />}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
        Жабы (Игра)
      </h1>
      <div className="flex justify-center space-x-2 sm:space-x-4 mb-2 sm:mb-4 flex-wrap gap-2">
        <MoveCounter moves={moves} />
        <Timer time={time} />
      </div>
      <GameBoard
        frogs={frogs}
        onFrogClick={handleFrogClick}
        animatingFrogIndex={animatingFrogIndex}
        animatingFromPosition={animatingFromPosition}
        animatingToPosition={animatingToPosition}
      />
      <div className="flex justify-center gap-2 sm:gap-4 mb-4 flex-wrap">
        <button
          className="bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-green-600 transition-all touch-manipulation text-sm sm:text-base"
          onClick={handleRestart}
        >
          НАЧАТЬ ЗАНОВО
        </button>
        <button
          className="bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded hover:bg-gray-600 transition-all touch-manipulation text-sm sm:text-base"
          onClick={handleBackToMenu}
        >
          В ГЛАВНОЕ МЕНЮ
        </button>
      </div>
      <HighScores scores={highScores} />
      {isGameWon && (
        <WinScreen
          moves={moves}
          time={time}
          onRestart={handleRestart}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
};

export default Game;
