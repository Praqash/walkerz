"use client";

import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import {
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { auth, isFirebaseConfigured } from "@/lib/firebase";

type AuthMode = "login" | "signup";

type AuthModalProps = {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
};

const provider = new GoogleAuthProvider();

const getAuthErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message.replace("Firebase: ", "");
  }

  return "Authentication failed. Please try again.";
};

export default function AuthModal({ isOpen, initialMode, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

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
      setMessage("Firebase is not configured yet. Add Firebase environment variables to enable Google login.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (error) {
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const getRecaptchaVerifier = () => {
    if (!auth) {
      return null;
    }

    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }

    return recaptchaVerifierRef.current;
  };

  const handleSendOtp = async () => {
    if (!auth) {
      setMessage("Firebase is not configured yet. Add Firebase environment variables to enable mobile OTP.");
      return;
    }

    if (!phoneNumber.trim().startsWith("+")) {
      setMessage("Enter the mobile number with country code, for example +919876543210.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const verifier = getRecaptchaVerifier();

      if (!verifier) {
        throw new Error("Unable to start phone verification.");
      }

      confirmationResultRef.current = await signInWithPhoneNumber(auth, phoneNumber.trim(), verifier);
      setMessage("OTP sent. Please enter the verification code.");
    } catch (error) {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
      setMessage(getAuthErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResultRef.current) {
      setMessage("Please request an OTP first.");
      return;
    }

    if (!otp.trim()) {
      setMessage("Enter the OTP sent to your mobile number.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await confirmationResultRef.current.confirm(otp.trim());
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
        <button className="close-button" type="button" onClick={onClose} aria-label="Close authentication dialog">
          <CloseIcon fontSize="small" />
        </button>

        <div className="auth-tabs" role="tablist" aria-label="Authentication options">
          <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>
            Login
          </button>
          <button className={mode === "signup" ? "active" : ""} type="button" onClick={() => setMode("signup")}>
            Sign up
          </button>
        </div>

        <div className="auth-heading">
          <p className="eyebrow">{mode === "login" ? "Welcome back" : "Create account"}</p>
          <h2>{mode === "login" ? "Login to Walkerz" : "Sign up for Walkerz"}</h2>
          <span>Use Google or mobile OTP. New users are created automatically after verification.</span>
        </div>

        {!isFirebaseConfigured ? (
          <div className="auth-alert">
            Firebase is not configured yet. Add the values from `.env.example` in Vercel and locally to enable live login.
          </div>
        ) : null}

        <button className="secondary-button full-width" type="button" onClick={handleGoogleAuth} disabled={isLoading}>
          <GoogleIcon fontSize="small" />
          Continue with Gmail
        </button>

        <div className="auth-divider"><span>or use mobile OTP</span></div>

        <div className="booking-form auth-form">
          <div className="input-group">
            <label htmlFor="phoneNumber">Mobile number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+919876543210"
            />
          </div>
          <button className="secondary-button full-width" type="button" onClick={handleSendOtp} disabled={isLoading}>
            <PhoneIphoneIcon fontSize="small" />
            Send OTP
          </button>

          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="Enter verification code"
            />
          </div>
          <button className="primary-button full-width" type="button" onClick={handleVerifyOtp} disabled={isLoading}>
            Verify and continue
          </button>
        </div>

        {message ? <p className="auth-message">{message}</p> : null}
        <div id="recaptcha-container" />
      </div>
    </section>
  );
}
