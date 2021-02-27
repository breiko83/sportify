import React from "react";
import Login from "./components/login/Login";
import Controls from "./components/controls/Controls";
import Player from "components/player/Player";

function App() {

  return (
    <div>
      <h1>Welcome to Sportify app</h1>
      <Login />
      <Controls />
      <Player />
    </div>
  );
}

export default App;
