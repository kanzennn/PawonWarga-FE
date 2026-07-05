"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  changePassword as changePasswordRequest,
  fetchProfile,
  logoutAllDevices as logoutAllDevicesRequest,
  loginUser,
  registerUser,
  updateProfile as updateProfileRequest,
  uploadProfilePicture,
  type RegisterInput,
  type UpdateProfileInput,
} from "@/lib/auth-api";
import type { AuthUser } from "@/lib/types";

const TOKEN_STORAGE_KEY = "pawonwarga_token";

function readStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  // Invalidates every session (including this one) then clears local state —
  // caller is responsible for redirecting to /login afterwards.
  logoutAllDevices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  // Starts true only when a token is actually present to verify — otherwise
  // there's nothing to load, so we're not "loading" from the first render.
  const [isLoading, setIsLoading] = useState<boolean>(() => readStoredToken() !== null);

  // Restore session from localStorage on first mount. When there's no stored
  // token, isLoading is already false from the initializer above, so this
  // effect has nothing to do — no synchronous setState in that branch.
  useEffect(() => {
    const storedToken = readStoredToken();
    if (!storedToken) return;

    fetchProfile(storedToken)
      .then((profile) => {
        setToken(storedToken);
        setUser(profile);
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginUser(email, password);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
    setToken(result.token);
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      await registerUser(input);
      await login(input.email, input.password);
    },
    [login],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (input: UpdateProfileInput) => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const updated = await updateProfileRequest(token, input);
      setUser(updated);
    },
    [token],
  );

  const uploadAvatar = useCallback(
    async (file: File) => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      const updated = await uploadProfilePicture(token, file);
      setUser(updated);
    },
    [token],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      await changePasswordRequest(token, currentPassword, newPassword);
    },
    [token],
  );

  const logoutAllDevices = useCallback(async () => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    await logoutAllDevicesRequest(token);
    logout();
  }, [token, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      uploadAvatar,
      changePassword,
      logoutAllDevices,
    }),
    [user, token, isLoading, login, register, logout, updateProfile, uploadAvatar, changePassword, logoutAllDevices],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
