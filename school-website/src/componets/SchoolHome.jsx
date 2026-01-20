import React from 'react';

function SchoolHome() {
  return (
    <div className="school_home_page">
      <h1>Welcome to Our School</h1>
      <p>This is the home page of our school website.</p>
      <ul>
        <li><a href="About">About Us</a></li>
        <li><a href="Contact">Contact Us</a></li>
        <li><a href="News">News & Events</a></li>
        <li><a href="Login">Login / Signup</a></li>
      </ul>
    </div>
  );
}

export default SchoolHome;
