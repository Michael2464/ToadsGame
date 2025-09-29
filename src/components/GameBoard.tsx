import React from "react";

interface Frog {
  color: "red" | "blue";
  direction: "left" | "right";
  position: number;
}

const GameBoard: React.FC<{
  frogs: Frog[];
  onFrogClick: (index: number) => void;
}> = ({ frogs, onFrogClick }) => {
  const stones = Array(7)
    .fill(null)
    .map((_, i) => {
      const frog = frogs.find((f) => f.position === i);
      return (
        <div
          key={i}
          className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-2"
          onClick={() => frog && onFrogClick(frogs.indexOf(frog))}
        >
          {frog && (
            <div
              className={`w-12 h-12 rounded-full ${
                frog.color === "red" ? "bg-red-500" : "bg-blue-500"
              } flex items-center justify-center text-white transform ${
                frog.direction === "left" ? "scale-x-[-1]" : ""
              }`}
            >
              🐸
            </div>
          )}
        </div>
      );
    });

  return <div className="flex justify-center my-4">{stones}</div>;
};

export default GameBoard;
