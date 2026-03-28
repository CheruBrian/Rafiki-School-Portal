import React from "react";
import Schoolhome from "./componets/Schoolhome.jsx";
import SchoolAbout from "./componets/SchoolAbout.jsx";
import SchoolContact from "./componets/SchoolContact.jsx";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
    <BrowserRouter>
      <Route path="/" component={Schoolhome} />
      <Route path="/about" component={SchoolAbout} />
      <Route path="/contact" component={SchoolContact} />
    </BrowserRouter>
    </>
  );
}

export default App;
