"use client";

import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
};

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message.replace("Firebase: ", "");
  }

  return "Authentication failed. Please try again.";
};

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setMessage("");
    }
  }, [initialMode, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleGoogleAuth = async () => {
    if (!auth) {
      setMessage(
        "Firebase is not configured yet. Add Firebase environment variables to enable Gmail login.",
      );
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-backdrop" aria-label="Authentication dialog">
      <div className="auth-card card">
        <button
          className="close-button"
          type="button"
          onClick={onClose}
          aria-label="Close authentication dialog"
        >
          <CloseIcon fontSize="small" />
        </button>

        <div
          className="auth-tabs"
          role="tablist"
          aria-label="Authentication options"
        >
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            type="button"
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">
            {mode === "login" ? "Welcome back" : "Create account"}
          </p>
          <h2>
            {mode === "login" ? "Login to Walkerz" : "Sign up for Walkerz"}
          </h2>
          <span>
            Use your Gmail account to continue. New users are created
            automatically after Google verification.
          </span>
        </div>

        {!isFirebaseConfigured ? (
          <div className="auth-alert">
            Firebase is not configured yet. Add the values from `.env.example`
            in Vercel and locally to enable live Gmail login.
          </div>
        ) : null}

        <button
          className="secondary-button full-width"
          type="button"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <GoogleIcon fontSize="small" />
          Continue with Gmail
        </button>

        {message ? <p className="auth-message">{message}</p> : null}
      </div>
    </section>
  );
}
