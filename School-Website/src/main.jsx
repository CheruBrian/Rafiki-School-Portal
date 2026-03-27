import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Buffer } from 'buffer';
import { URL } from 'url';
import { BrowserRouter, createBrowserRouter, Routes } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Schoolhome from './componets/Schoolhome.jsx';
import SchoolContact from './componets/SchoolContact.jsx';


window.Buffer = Buffer;
window.URL = URL;

document.title = "School Website"
URL.createObjectURL = (file) => {
  return `file://${Schoolhome.getFilePath(file)}`;
};

BrowserRouter.prototype.createHref = function (location) {
  return location.pathname + location.search + location.hash;
};

url = new URL('http://localhost');
url.pathname = '/';
url.search = '';
url.hash = '';
const href = url.href;
BrowserRouter.prototype.createHref = function (location) {
  return href + location.pathname + location.search + location.hash;
};

createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/schoolhome', element: <Schoolhome /> },
  { path: '/about', element: <SchoolAbout /> },
  { path: '/contact', element: <SchoolContact /> },
  { path: '*', element: <div>404 Not Found</div> },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
