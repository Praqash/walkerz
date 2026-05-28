"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isReady: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      setIsReady(true);
      return undefined;
    }

    return onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsReady(true);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      logout: async () => {
        if (auth) {
          await signOut(auth);
        }
      },
    }),
    [user, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
