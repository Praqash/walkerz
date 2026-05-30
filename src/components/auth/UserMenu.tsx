"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";
import UserProfileModal from "./UserProfileModal";

type AuthMode = "login" | "signup";

export default function UserMenu() {
  const { user, isReady, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuthModal = (nextMode: AuthMode) => {
    setMode(nextMode);
    setIsModalOpen(true);
  };

  if (!isReady) {
    return <div className="auth-actions skeleton-action" aria-hidden="true" />;
  }

  if (user) {
    const displayName = user.displayName ?? user.email ?? "Guest";

    return (
      <div className="auth-actions signed-in-actions">
        <button
          className="user-chip"
          type="button"
          title={displayName}
          onClick={() => setIsProfileOpen(true)}
        >
          {user.photoURL ? (
            <span
              className="user-avatar"
              style={{ backgroundImage: `url(${user.photoURL})` }}
              aria-hidden="true"
            />
          ) : (
            <AccountCircleIcon fontSize="small" />
          )}
          <span className="user-chip-label">{displayName}</span>
        </button>
        <button
          className="secondary-button compact-button"
          type="button"
          onClick={logout}
        >
          <LogoutIcon fontSize="small" />
          <span className="logout-label">Logout</span>
        </button>
        <UserProfileModal
          isOpen={isProfileOpen}
          user={user}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <button
        className="secondary-button compact-button"
        type="button"
        onClick={() => openAuthModal("login")}
      >
        <LoginIcon fontSize="small" />
        Login
      </button>
      <button
        className="primary-button compact-button"
        type="button"
        onClick={() => openAuthModal("signup")}
      >
        <PersonAddIcon fontSize="small" />
        Sign up
      </button>
      <AuthModal
        isOpen={isModalOpen}
        initialMode={mode}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
