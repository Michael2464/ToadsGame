import React from "react";

interface HighScore {
  moves: number;
  time: number;
  date: string;
}

const HighScores: React.FC<{ scores: HighScore[] }> = ({ scores }) => (
  <div className="mt-4">
    <h2 className="text-3xl font-bold mb-2">Лучшая статистика</h2>
    <ul className="text-xl pl-5">
      {scores.map((score, index) => (
        <li key={index}>
          Ходов: {score.moves}, Время: {Math.floor(score.time / 60)}:
          {(score.time % 60).toString().padStart(2, "0")}, Дата: {score.date}
        </li>
      ))}
    </ul>
  </div>
);

export default HighScores;
