import { useState } from 'react';
import { useRecipeStore } from './recipeStore';
import { useNavigate } from 'react-router-dom';

function SchoolHome() {
  return (
    <div className="school_home_page">
      <h1>Welcome to Our School</h1>
      <p>This is the home page of our school website.</p>
      <ul>
        <ol><a href="About">About Us</a></ol>
        <ol><a href="Contact">Contact Us</a></ol>
        <ol><a href="News">News & Events</a></ol>
        <ol><a href="Login">Login / Signup</a></ol>
      </ul>
    </div>
  );
}

export default SchoolHome;
