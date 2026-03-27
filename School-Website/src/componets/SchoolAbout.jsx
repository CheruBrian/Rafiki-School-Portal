import from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Schoolhome from "./Schoolhome.jsx";
import SchoolContact from "./SchoolContact.jsx";
import SchoolAbout from "./SchoolAbout.jsx";


function SchoolAbout() {
    return (
        <div>
            <h2>About Our School</h2>
            <p>Welcome to our school! We are dedicated to providing a nurturing and inclusive environment for our students. Our mission is to foster academic excellence, creativity, and personal growth.</p>
            <p>Our school offers a wide range of programs and extracurricular activities to support the diverse interests and talents of our students. We believe in empowering our students to become lifelong learners and responsible global citizens.</p>
            <p>Thank you for visiting our website. We look forward to welcoming you to our school community!</p>
        </div>
    );
} 
export default SchoolAbout;