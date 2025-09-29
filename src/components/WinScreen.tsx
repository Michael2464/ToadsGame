import React from "react";

const WinScreen: React.FC<{
  moves: number;
  time: number;
  onRestart: () => void;
}> = ({ moves, time, onRestart }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4">Поздравляем!</h2>
      <p>Ходов: {moves}</p>
      <p>
        Времени: {Math.floor(time / 60)}:
        {(time % 60).toString().padStart(2, "0")}
      </p>
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={onRestart}
      >
        REINICIAR
      </button>
    </div>
  </div>
);

export default WinScreen;
