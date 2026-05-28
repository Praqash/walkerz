"use client";

import { AuthProvider } from "./AuthProvider";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
