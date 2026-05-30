"use client";

import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
};

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Authentication failed. Please try again.";
};

const getRedirectUrl = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.origin;
};

export default function AuthModal({
  isOpen,
  initialMode,
  onClose,
}: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
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
    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Add Supabase environment variables to enable Google login.",
      );
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
      setIsLoading(false);
    }
  };

  const handleEmailOtp = async () => {
    if (!supabase) {
      setMessage(
        "Supabase is not configured yet. Add Supabase environment variables to enable email OTP.",
      );
      return;
    }

    if (!email.trim()) {
      setMessage("Enter your email address to receive the login link.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectUrl(),
          shouldCreateUser: mode === "signup",
        },
      });

      if (error) {
        throw error;
      }

      setMessage("Check your email for the secure login link from Walkerz.");
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
            Use Gmail or a secure email OTP link. New users are created during
            sign up.
          </span>
        </div>

        {!isSupabaseConfigured ? (
          <div className="auth-alert">
            Supabase is not configured yet. Add the values from `.env.example`
            in Vercel and locally to enable live login.
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

        <div className="auth-divider">
          <span>or use email OTP</span>
        </div>

        <div className="booking-form auth-form">
          <div className="input-group">
            <label htmlFor="authEmail">Email address</label>
            <input
              id="authEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button
            className="primary-button full-width"
            type="button"
            onClick={handleEmailOtp}
            disabled={isLoading}
          >
            <EmailIcon fontSize="small" />
            Send secure login link
          </button>
        </div>

        {message ? <p className="auth-message">{message}</p> : null}
      </div>
    </section>
  );
}
