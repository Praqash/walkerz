"use client";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";

type AuthMode = "login" | "signup";

export default function UserMenu() {
  const { user, isReady, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuthModal = (nextMode: AuthMode) => {
    setMode(nextMode);
    setIsModalOpen(true);
  };

  if (!isReady) {
    return <div className="auth-actions skeleton-action" aria-hidden="true" />;
  }

  if (user) {
    return (
      <div className="auth-actions signed-in-actions">
        <span className="user-chip" title={user.email ?? user.phoneNumber ?? "Signed in user"}>
          <AccountCircleIcon fontSize="small" />
          {user.displayName ?? user.email ?? user.phoneNumber ?? "Guest"}
        </span>
        <button className="secondary-button compact-button" type="button" onClick={logout}>
          <LogoutIcon fontSize="small" />
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-actions">
      <button className="secondary-button compact-button" type="button" onClick={() => openAuthModal("login")}>
        <LoginIcon fontSize="small" />
        Login
      </button>
      <button className="primary-button compact-button" type="button" onClick={() => openAuthModal("signup")}>
        <PersonAddIcon fontSize="small" />
        Sign up
      </button>
      <AuthModal isOpen={isModalOpen} initialMode={mode} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
