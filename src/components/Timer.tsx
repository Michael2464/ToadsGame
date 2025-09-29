import React from "react";

const Timer: React.FC<{ time: number }> = ({ time }) => (
  <div className="text-xl font-bold">
    Время: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
  </div>
);

export default Timer;
