import React from "react";

const MoveCounter: React.FC<{ moves: number }> = ({ moves }) => (
  <div className="text-xl font-bold">Ходов: {moves}</div>
);

export default MoveCounter;
