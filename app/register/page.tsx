"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {Eye, EyeOff, OctagonAlert} from "lucide-react";
import AuthField from "@/components/auth/AuthField";
import AuthLayout from "@/components/auth/AuthLayout";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        password: form.password,
        phoneNumber: form.phoneNumber,
      });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Create New Account"
      subtitle={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-black text-[#b9fb7d] hover:underline">
            Sign In
          </Link>
        </>
      }
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <AuthField
            label="First Name"
            required
            value={form.firstName}
            onChange={(value) => updateField("firstName", value)}
            placeholder="First name"
          />
          <AuthField
            label="Last Name"
            required
            value={form.lastName}
            onChange={(value) => updateField("lastName", value)}
            placeholder="Last name"
          />
        </div>

        <AuthField
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(value) => updateField("email", value)}
          placeholder="name@email.com"
        />

        <AuthField
          label="Phone Number"
          type="tel"
          required
          minLength={8}
          maxLength={20}
          value={form.phoneNumber}
          onChange={(value) => updateField("phoneNumber", value)}
          placeholder="08xxxxxxxxxx"
        />

        <AuthField
          label="Password"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          value={form.password}
          onChange={(value) => updateField("password", value)}
          placeholder="Minimum 8 characters"
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
          {isSubmitting ? "Signing up..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
