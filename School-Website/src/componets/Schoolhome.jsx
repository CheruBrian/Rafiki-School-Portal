import React from "react";
import "./Schoolhome.css";

function Schoolhome() {
    return (
        <div>
            <h1>Welcome to Our School</h1>
            <p>This is where you can learn and grow.</p>
            <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/programs">Programs</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
            <div className="body">
                <h2>Our Mission</h2>
                <p>What is our mission and how can we do about it.</p>
                <h2>Our Vision</h2>
                <p>To provide an excellent education that prepares students for the future.</p>
                <h2>Our Values</h2>
                <p>Integrity, Excellence, and Community.</p>
                <h2>Contact Us</h2>
                <p>Email: contact@ourschool.edu</p>
                <p>Phone: (123) 456-7890</p>
                
            </div>
            <div className="footer">
                <p>&copy; 2023 Our School. All rights reserved.</p>
            </div>     
        </div>
    
    );
}
export default Schoolhome;