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
      <h2>Our Mission</h2>
      <h2>Upcoming News</h2>
    </div>
    <div className="class-footer">
        <p>&copy; 2026 Our School all rights reserved</p>
      </div>
    </>
  );
}
export default SchoolHome;