import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SchoolHome from './componets/SchoolHome';
import SchoolAbout from './componets/SchoolAbout';
import SchoolContact from './componets/SchoolContact';
import SchoolEventsNews from './componets/SchoolEventsNews';
import SchoolLogin from './componets/SchoolLogin';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<SchoolHome />} />
          <Route path="/about" element={<SchoolAbout />} />
          <Route path="/contact" element={<SchoolContact />} />
          <Route path="/events-news" element={<SchoolEventsNews />} />
          <Route path="/login" element={<SchoolLogin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
