import React from "react";
import { Outlet } from "react-router-dom";

function Home() {
  return (
    <>
      <div>Header</div>
      <Outlet />
    </>
  );
}

export default Home;
