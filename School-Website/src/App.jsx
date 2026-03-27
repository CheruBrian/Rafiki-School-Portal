import React from "react";
import Schoolhome from "./componets/Schoolhome.jsx";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
    <BrowserRouter>
      <Route path="/" component={Schoolhome} />
      <Route path="/about" component={SchoolAbout} />
    </BrowserRouter>
    </>
  )
}

export default App;
