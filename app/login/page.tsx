"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async (
      e: React.FormEvent
    ) => {

      e.preventDefault();

      setLoading(true);

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {

        alert(error.message);

        setLoading(false);

        return;
      }

      alert(
        "Login successful"
      );

      setLoading(false);

      router.push("/");
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">

      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">

        {/* HEADER */}

        <h1 className="text-4xl font-bold">
          Login
        </h1>

        <p className="mt-3 text-gray-600">
          Access inventory dashboard.
        </p>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
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
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* SIGNUP LINK */}

        <p className="mt-6 text-center text-gray-600">

          Don’t have an account?

          <Link
            href="/signup"
            className="ml-2 font-semibold text-blue-600"
          >
            Signup
          </Link>

        </p>

      </div>

    </main>
  );
}