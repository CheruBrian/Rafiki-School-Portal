import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/useAuth";

const ProfileMenu = ({ userName = "User", onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);
  const { changePassword } = useAuth();
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

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }

    setPasswordSubmitting(true);
    const result = await changePassword(
      passwordForm.current,
      passwordForm.next,
    );
    setPasswordSubmitting(false);
    if (!result.success) {
      setPasswordError(result.error);
      return;
    }
    setPasswordForm({ current: "", next: "", confirm: "" });
    setPasswordMessage("Password updated.");
  };

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
                setShowPasswordForm((visible) => !visible);
                setPasswordMessage("");
                setPasswordError("");
              }}
            >
              {showPasswordForm ? "Cancel password change" : "Change password"}
            </button>
            {showPasswordForm && (
              <form
                className="profile-password-form"
                onSubmit={handlePasswordChange}
              >
                <label htmlFor="currentPassword">Current password</label>
                <input
                  id="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  value={passwordForm.current}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      current: event.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="newPassword">New password</label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordForm.next}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      next: event.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="confirmPassword">Confirm new password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  value={passwordForm.confirm}
                  onChange={(event) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirm: event.target.value,
                    })
                  }
                  required
                />
                {passwordError && (
                  <p className="profile-password-error" role="alert">
                    {passwordError}
                  </p>
                )}
                {passwordMessage && (
                  <p className="profile-password-success" role="status">
                    {passwordMessage}
                  </p>
                )}
                <button type="submit" disabled={passwordSubmitting}>
                  {passwordSubmitting ? "Updating..." : "Update password"}
                </button>
              </form>
            )}
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
