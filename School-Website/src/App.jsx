import React from "react";
import Schoolhome from "./componets/Schoolhome.jsx";
import { BrowserRouter, Route } from "react-router-dom";

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Schoolhome />} />
      <Route path="/about" element={<div>About Page</div>} />
      <Route path="/contact" element={<div>Contact Page</div>} />
      <Route path="*" element={<div>404 Not Found</div>} /> 
    </Routes>
    </>
  )
}

export default App;
