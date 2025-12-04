import { useState, useEffect } from "react";

interface Frog {
  color: "red" | "blue";
  direction: "left" | "right";
  position: number;
}

const GameBoard: React.FC<{
  frogs: Frog[];
  onFrogClick: (index: number) => void;
  animatingFrogIndex?: number | null;
  animatingFromPosition?: number | null;
  animatingToPosition?: number | null;
}> = ({
  frogs,
  onFrogClick,
  animatingFrogIndex = null,
  animatingFromPosition = null,
  animatingToPosition = null,
}) => {
  const [animationDistance, setAnimationDistance] = useState(70);

  useEffect(() => {
    const updateDistance = () => {
      if (window.innerWidth < 360) {
        setAnimationDistance(30);
      } else if (window.innerWidth < 375) {
        setAnimationDistance(35);
      } else if (window.innerWidth < 640) {
        setAnimationDistance(42);
      } else if (window.innerWidth < 768) {
        setAnimationDistance(70);
      } else {
        setAnimationDistance(120);
      }
    };

    updateDistance();
    window.addEventListener("resize", updateDistance);
    return () => window.removeEventListener("resize", updateDistance);
  }, []);
  const stones = Array(7)
    .fill(null)
    .map((_, i) => {
      const frog = frogs.find((f) => f.position === i);
      const frogIndex = frog ? frogs.indexOf(frog) : -1;
      const isAnimatingThisFrog =
        animatingFromPosition === i && animatingFrogIndex !== null;
      const isAnimatingToThis = animatingToPosition === i && !frog;

      let animationStyle: React.CSSProperties = {};

      if (
        isAnimatingThisFrog &&
        animatingFromPosition !== null &&
        animatingToPosition !== null
      ) {
        const currentPos = animatingFromPosition;
        const targetPos = animatingToPosition;
        const direction = targetPos > currentPos ? 1 : -1;
        const distance = Math.abs(targetPos - currentPos);
        animationStyle = {
          transform: `translateX(${
            direction * distance * animationDistance
          }px) scale(1.1)`,
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 20,
        };
      }

      return (
        <div
          key={i}
          className="relative w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 mx-0 xs:mx-0.5 sm:mx-0.5 md:mx-1 lg:mx-2 z-[10] touch-manipulation cursor-pointer flex-shrink-0"
          style={{ minWidth: "44px" }}
        >
          {/* Stone visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-14 h-9 xs:w-16 xs:h-10 sm:w-18 sm:h-11 md:w-20 md:h-12 lg:w-24 lg:h-14 xl:w-28 xl:h-16 bg-gradient-to-b from-stone-600 via-stone-500 to-stone-700 rounded-lg shadow-2xl border border-stone-800/50 transform rotate-[-5deg] hover:scale-105 transition-all">
              {/* Stone texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-400/30 to-stone-800/30 rounded-lg"></div>
              <div className="absolute top-0.5 left-1 xs:top-0.5 xs:left-1 sm:top-1 sm:left-2 w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-stone-300/40 rounded-full"></div>
              <div className="absolute top-1 right-1 xs:top-1.5 xs:right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 w-0.5 h-0.5 xs:w-1 xs:h-1 sm:w-1 sm:h-1 md:w-1.5 md:h-1.5 bg-stone-300/30 rounded-full"></div>
              <div className="absolute bottom-0.5 left-1.5 xs:bottom-1 xs:left-2 sm:bottom-1.5 sm:left-3 md:bottom-2 md:left-4 w-0.5 h-0.5 xs:w-0.5 xs:h-0.5 sm:w-0.5 sm:h-0.5 md:w-1 md:h-1 bg-stone-300/50 rounded-full"></div>
              {/* Water reflection on stone */}
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-stone-300/20 to-transparent rounded-t-lg"></div>
            </div>
          </div>

          {/* Frog container */}
          <div
            className="relative w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 flex items-center justify-center z-[15] transition-all"
            onClick={() => frog && onFrogClick(frogIndex)}
            onTouchStart={(e) => {
              e.preventDefault();
              if (frog) {
                onFrogClick(frogIndex);
              }
            }}
          >
            {frog && (
              <div
                className={`relative w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full ${
                  frog.color === "red"
                    ? "bg-gradient-to-br from-red-500 to-red-700"
                    : "bg-gradient-to-br from-blue-500 to-blue-700"
                } flex items-center justify-center transform z-[15] shadow-xl border xs:border-2 sm:border-2 md:border-3 ${
                  frog.color === "red" ? "border-red-800" : "border-blue-800"
                } transition-all duration-300 hover:scale-110 hover:shadow-2xl`}
                style={{
                  ...animationStyle,
                  borderStyle: "solid",
                }}
              >
                <span className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl filter drop-shadow-2xl">
                  🐸
                </span>
                <div
                  className={`absolute -bottom-0.5 xs:-bottom-1 sm:-bottom-1 text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl ${
                    frog.direction === "right"
                      ? "right-0 transform translate-x-0.5 xs:translate-x-1 sm:translate-x-2"
                      : "left-0 transform -translate-x-0.5 xs:-translate-x-1 sm:-translate-x-2"
                  }`}
                >
                  {frog.direction === "right" ? "→" : "←"}
                </div>
                {isAnimatingThisFrog && (
                  <div className="absolute inset-0 rounded-full bg-white/30 animate-ping"></div>
                )}
              </div>
            )}
            {isAnimatingToThis && (
              <div className="absolute w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-18 lg:h-18 xl:w-20 xl:h-20 rounded-full bg-green-300/40 animate-pulse border border-green-400 xs:border-2 z-[12]"></div>
            )}
          </div>
        </div>
      );
    });

  return (
    <div className="relative flex justify-center items-center my-2 sm:my-4 min-h-[180px] xs:min-h-[200px] sm:min-h-[280px] md:min-h-[350px] lg:min-h-[450px] w-full max-w-5xl mx-auto overflow-x-auto">
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/30 z-[0]"></div>

      {/* Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        src="./boloto.jpg"
        alt="Swamp background"
      />

      {/* Stones and Frogs */}
      <div className="relative flex justify-center items-center z-[1] px-0.5 xs:px-1 sm:px-2 md:px-4 min-w-fit">
        {stones}
      </div>
    </div>
  );
};

export default GameBoard;
