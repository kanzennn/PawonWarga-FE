"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Eye, EyeOff, OctagonAlert} from "lucide-react";
import AuthField from "@/components/auth/AuthField";
import AuthLayout from "@/components/auth/AuthLayout";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Sign In to Your Account"
      subtitle={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-black text-[#b9fb7d] hover:underline">
            Sign Up
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <AuthField
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          placeholder="name@email.com"
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          value={form.password}
          onChange={(value) => setForm((current) => ({ ...current, password: value }))}
          placeholder="Enter your password"
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-white/40 hover:text-white/70"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-[#ff8b8b]/25 bg-[#ff8b8b]/10 px-4 py-3 text-sm font-bold text-[#ff8b8b]">
            <OctagonAlert size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-12 rounded-2xl bg-gradient-to-br from-[#dcffc5] to-[#c8f7a6] font-black text-[#052d22] transition disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}
