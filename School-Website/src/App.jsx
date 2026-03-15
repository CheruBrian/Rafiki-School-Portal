import React from "react";
import Schoolhome from "./componets/Schoolhome.jsx";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
    <h1>Welcome to School Website</h1>
    <h2>School Information</h2>
    <BrowserRouter>
      <Route path="/" component={Schoolhome} />
    </BrowserRouter>
    </>
  )
}

export default App;
