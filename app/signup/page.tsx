"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =========================
     HANDLE SIGNUP
  ========================= */

  const handleSignup =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      /* =========================
         CREATE AUTH USER
      ========================= */

      const {
        data,
        error,
      } =
        await supabase.auth.signUp({
          email,
          password,
        });

      if (error) {

        alert(error.message);

        setLoading(false);

        return;
      }

      /* =========================
         CREATE PROFILE
      ========================= */

      const user =
        data.user;

      if (user) {

        const {
          error: profileError,
        } =
          await supabase
            .from("profiles")
            .insert([
              {
                id: user.id,
                email: user.email,
                role: "viewer",
              },
            ]);

        if (profileError) {

          console.error(
            profileError
          );

          alert(
            "Profile creation failed"
          );

          setLoading(false);

          return;
        }
      }

      /* =========================
         SUCCESS
      ========================= */

      alert(
        "Signup successful"
      );

      setLoading(false);

      router.push("/login");
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">

        {/* HEADER */}

        <h1 className="text-4xl font-bold">
          Create Account
        </h1>

        <p className="mt-3 text-gray-600">
          Signup for inventory access.
        </p>

        {/* FORM */}

        <form
          onSubmit={handleSignup}
          className="mt-8 space-y-5"
        >

          {/* EMAIL */}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-4"
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-4"
          />

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black p-4 text-white hover:bg-gray-800"
          >

            {loading
              ? "Creating Account..."
              : "Signup"}

          </button>

        </form>

        {/* LOGIN LINK */}

        <p className="mt-6 text-center text-gray-600">

          Already have an account?

          <Link
            href="/login"
            className="ml-2 font-semibold text-blue-600"
          >
            Login
          </Link>

        </p>

      </div>

    </main>
  );
}