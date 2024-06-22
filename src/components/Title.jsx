import React from "react";
import Rocket from "../assets/shuttle (1).png";

function Title() {
  return (
    <div className="flex gap-2">
      <h1 className="text-3xl">ChatDev</h1>
      <img src={Rocket} alt={Rocket} className="h-7 rocket" />
    </div>
  );
}

export default Title;
