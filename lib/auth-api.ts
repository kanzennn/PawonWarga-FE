import { apiFetch, apiUpload } from "@/lib/api-client";
import type { AuthUser } from "@/lib/types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

export interface UpdateProfileInput {
  name: string;
  phoneNumber: string;
}

export function registerUser(input: RegisterInput): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
      phone_number: input.phoneNumber,
    }),
  });
}

export function loginUser(email: string, password: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchProfile(token: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/profile", { token });
}

export function updateProfile(token: string, input: UpdateProfileInput): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/profile", {
    method: "PUT",
    token,
    body: JSON.stringify({ name: input.name, phone_number: input.phoneNumber }),
  });
}

export function uploadProfilePicture(token: string, file: File): Promise<AuthUser> {
  const formData = new FormData();
  formData.append("file", file);
  return apiUpload<AuthUser>("/auth/profile/picture", formData, token);
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await apiFetch<null>("/auth/password", {
    method: "PUT",
    token,
    body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
  });
}

// Invalidates every session, including the one calling this — callers
// should log the user out locally and redirect to /login right after.
export async function logoutAllDevices(token: string): Promise<void> {
  await apiFetch<null>("/auth/logout-all", { method: "POST", token });
}
