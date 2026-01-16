import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SchoolHome from './components/SchoolHome';
import SchoolAbout from './components/SchoolAbout';
import SchoolContact from './components/SchoolContact';
import SchoolEventsNews from './components/SchoolEventsNews';
import SchoolLogin from './components/SchoolLogin';
import './App.css';

function App() {
  return (
    <div className="App">
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
