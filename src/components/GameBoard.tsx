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
          className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center mx-2 z-[10]"
          onClick={() => frog && onFrogClick(frogs.indexOf(frog))}
        >
          {frog && (
            <div
              className={`text-5xl w-20 h-20 rounded-full ${
                frog.color === "red" ? "bg-red-500" : "bg-blue-500"
              } flex items-center justify-center text-white transform z-[10]`}
            >
              🐸
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="relative flex justify-center items-center my-4 min-h-[500px] w-full max-w-5xl mx-auto">
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/30 z-[0]"></div>

      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        src="./boloto.jpg"
        alt="Swamp background"
      />

      {/* Stones and Frogs */}
      <div className="relative flex justify-center items-center z-[1]">
        {stones}
      </div>
    </div>
  );
};

export default GameBoard;
