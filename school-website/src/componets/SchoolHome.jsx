import React from "react";
import { Link } from "react-router-dom";
import './SchoolHome.css';

function SchoolHome() {
  return (
    <>
    <div>
      <h1>Welcome to our School</h1>
      <p>This is the home page of our school website</p>
      <ul>
        <li><a href="/about">About Us</a></li>
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="/events-news">News & Events</a></li>
        <li><a href="/login">Login / Signup</a></li>
      </ul>
    </div>
    <div className="school-body">
      
      <div className="our-mission">
      <h2>Our Mission</h2>
      </div>
      
      <div className="upcoming-news">
       <h2>Upcoming News</h2>
      </div>
      
      <div className="contact-us">
        <h2>Contact Us</h2>
      <p>For any inquiries, please contact us through the form below:</p>
            <form name="contact-us-form">
                <label>
                    Name:
                    <input type="name" placeholder=" " minLength={3} maxLength={13}></input>
                    Email:
                    <input type="email" placeholder=" " minLength={4} maxLength={40}></input>
                    Phone number:
                    <input type="tel" placeholder=" " minLength={9} maxLength={20}></input>
                    <button type="Submit"></button>
                </label>
            </form>

      </div>
      
    </div>
    <div className="class-footer">
        <p>&copy; 2026 Our School all rights reserved</p>
      </div>
    </>
  );
}
export default SchoolHome;