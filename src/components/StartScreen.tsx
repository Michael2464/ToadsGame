import React from "react";

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center z-50 p-2">
      <div className="text-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl max-w-md mx-2 sm:mx-4">
        <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🐸</div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
          Жабы
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-4 sm:mb-6 md:mb-8 drop-shadow px-2">
          Переместите всех красных жаб направо, а синих - налево!
        </p>
        <p className="text-sm sm:text-base md:text-lg text-white/80 mb-4 sm:mb-6 md:mb-8 drop-shadow px-2">
          Правила: Жаба может прыгнуть на соседний камень или перепрыгнуть через
          одну жабу.
        </p>
        <button
          onClick={onStart}
          className="bg-green-500 hover:bg-green-600 text-white font-bold text-base sm:text-lg md:text-xl px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 touch-manipulation"
        >
          НАЧАТЬ ИГРУ
        </button>
      </div>
    </div>
  );
};

export default StartScreen;

