import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";



function SchoolContact() {
    return (
        <div>
            <h2>Contact Us</h2>
            <p>If you have any questions, feel free to reach out to us.</p>
            <ul>
                <li><a href="mailto:contact@ourschool.edu">Email Us</a></li>
                <li><a href="tel:+1234567890">Call Us</a></li>
                <li><a href="/contact-form">Contact Form</a></li>
            </ul>
        </div>
    );
}

export default SchoolConact;