"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AuthUser } from "@/types";
import { parseJwt } from "@/lib/auth";

export function useAuth() {
  const { user, isAuthenticated, login, logout, setUser } = useAuthStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("authUser");
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData) as AuthUser;
        login(parsed, token);
      } catch {
        logout();
      }
    }
    setHydrated(true);
  }, []);

  const signOut = () => {
    logout();
    router.push("/login");
  };

  const hasRole = (role: string) => {
    return user?.roles?.includes(role) || false;
  };

  const isAdmin = () => {
    return user?.roles?.some(r => ["super_admin", "school_admin", "principal"].includes(r)) || false;
  };

  return { user, isAuthenticated: isAuthenticated && hydrated, hydrated, signOut, hasRole, isAdmin, setUser };
}
