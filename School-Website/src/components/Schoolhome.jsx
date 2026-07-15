import React from "react";
import "./Schoolhome.css";
import { useNavigate } from "react-router-dom";

function Schoolhome() {
  const navigate = useNavigate();

  return (
    <div className="schoolhome-page">
      <header className="header-top">
        <div className="brand-block">
          <p className="eyebrow">Rafiki School Portal</p>
          <h1>Welcome to Our School</h1>
        </div>
        <div className="auth-buttons">
          <button className="btn-login" onClick={() => navigate("/login")}>
            Login
          </button>
          <button className="btn-signup" onClick={() => navigate("/login")}>
            Sign Up
          </button>
        </div>
      </header>

      <main className="schoolhome-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Nurturing bright futures</p>
            <h2>Discover a caring place to learn, grow, and lead.</h2>
            <p>
              This is where students build confidence, curiosity, and lifelong
              skills.
            </p>
          </div>
          <div className="hero-links">
            <a href="/about">About Us</a>
            <a href="/programs">Programs</a>
            <a href="/contact">Contact</a>
          </div>
        </section>

        <section className="info-grid">
          <article className="info-card">
            <h3>Our Mission</h3>
            <p>
              To create a safe and inspiring environment where every learner can
              thrive.
            </p>
          </article>
          <article className="info-card">
            <h3>Our Vision</h3>
            <p>
              To prepare students for the future through excellence, innovation,
              and care.
            </p>
          </article>
          <article className="info-card">
            <h3>Our Values</h3>
            <p>
              Integrity, excellence, curiosity, and community are at the heart
              of everything we do.
            </p>
          </article>
        </section>

        <section className="contact-card">
          <h3>Contact Us</h3>
          <p>Email: contact@ourschool.edu</p>
          <p>Phone: (123) 456-7890</p>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; 2023 Our School. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Schoolhome;
