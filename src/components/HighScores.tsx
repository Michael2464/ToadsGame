import React from "react";

interface HighScore {
  moves: number;
  time: number;
  date: string;
}

const HighScores: React.FC<{ scores: HighScore[] }> = ({ scores }) => (
  <div className="mt-4 sm:mt-6 max-w-2xl mx-auto px-2">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 text-center">Топ 10 игроков</h2>
    {scores.length === 0 ? (
      <p className="text-center text-gray-500 text-base sm:text-lg">Пока нет рекордов</p>
    ) : (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 sm:p-4 shadow-lg">
        <ul className="space-y-1 sm:space-y-2">
          {scores.map((score, index) => (
            <li
              key={index}
              className={`flex items-center justify-between p-2 sm:p-3 rounded-lg ${
                index === 0
                  ? "bg-yellow-100 border-2 border-yellow-400"
                  : index === 1
                  ? "bg-gray-100 border-2 border-gray-300"
                  : index === 2
                  ? "bg-orange-100 border-2 border-orange-300"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center space-x-1 sm:space-x-3 flex-1 min-w-0">
                <span className="text-lg sm:text-xl md:text-2xl font-bold w-6 sm:w-8 text-center flex-shrink-0">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center min-w-0">
                  <span className="font-semibold text-sm sm:text-base md:text-lg">
                    {score.moves} ходов
                  </span>
                  <span className="text-gray-600 sm:ml-2 text-xs sm:text-sm md:text-base">
                    {Math.floor(score.time / 60)}:
                    {(score.time % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 ml-2 flex-shrink-0 hidden sm:block">{score.date}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default HighScores;
