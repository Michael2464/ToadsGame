import React from "react";

const WinScreen: React.FC<{
  moves: number;
  time: number;
  onRestart: () => void;
  onBackToMenu: () => void;
}> = ({ moves, time, onRestart, onBackToMenu }) => (
  <div className="fixed z-50 inset-0 bg-black bg-opacity-70 flex items-center justify-center backdrop-blur-sm p-2">
    <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 sm:p-6 md:p-8 rounded-2xl text-center shadow-2xl max-w-md mx-2 sm:mx-4 animate-scale-in">
      <div className="text-5xl sm:text-6xl md:text-8xl mb-3 sm:mb-4 animate-bounce">
        🎉
      </div>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white drop-shadow-lg">
        Поздравляем!
      </h2>
      <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2">
          Ходов: <span className="text-yellow-200">{moves}</span>
        </p>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white">
          Времени:{" "}
          <span className="text-yellow-200">
            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:gap-3 mt-4">
        <button
          className="bg-white text-green-600 font-bold text-base sm:text-lg md:text-xl px-6 py-3 sm:px-8 sm:py-4 rounded-full hover:bg-green-50 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
          onClick={onRestart}
        >
          ИГРАТЬ СНОВА
        </button>
        <button
          className="bg-gray-200 text-gray-700 font-bold text-sm sm:text-base md:text-lg px-6 py-2 sm:px-8 sm:py-3 rounded-full hover:bg-gray-300 shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
          onClick={onBackToMenu}
        >
          В ГЛАВНОЕ МЕНЮ
        </button>
      </div>
    </div>
    <style>{`
      @keyframes scale-in {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
      .animate-scale-in {
        animation: scale-in 0.3s ease-out;
      }
    `}</style>
  </div>
);

export default WinScreen;
