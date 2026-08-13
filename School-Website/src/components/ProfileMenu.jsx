import React, { useEffect, useRef, useState } from "react";

const ProfileMenu = ({ userName = "User", onLogout, onEditProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const root = document.querySelector(".dashboard-container");
    if (!root) return;
    root.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";

  return (
    <div className="profile-menu-wrapper" ref={menuRef}>
      <button
        type="button"
        className="profile-trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open profile menu"
        title="Profile menu"
      >
        <span className="profile-avatar">{initials}</span>
      </button>

      {isOpen && (
        <aside className="profile-sidebar">
          <div className="profile-sidebar-header">
            <span className="profile-avatar large">{initials}</span>
            <div>
              <strong>{userName}</strong>
              <small>Profile</small>
            </div>
          </div>

          <nav
            className="profile-sidebar-nav"
            aria-label="User account options"
          >
            <button type="button" className="profile-menu-link">
              Settings
            </button>
            <button
              type="button"
              className="profile-menu-link"
              onClick={() => setDarkMode((prev) => !prev)}
            >
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
            <button
              type="button"
              className="profile-menu-link"
              onClick={() => {
                setIsOpen(false);
                if (onEditProfile) onEditProfile();
              }}
            >
              Edit profile
            </button>
            <button
              type="button"
              className="profile-menu-link danger"
              onClick={() => {
                setIsOpen(false);
                if (onLogout) onLogout();
              }}
            >
              Log out
            </button>
          </nav>
        </aside>
      )}
    </div>
  );
};

export default ProfileMenu;
