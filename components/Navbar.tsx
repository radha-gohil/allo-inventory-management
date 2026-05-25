"use client";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function Navbar() {

  const router =
    useRouter();

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout =
    async () => {

      try {

        await supabase.auth.signOut();

        router.push(
          "/login"
        );

        router.refresh();

      } catch (error) {

        console.error(error);
      }
    };

  return (
    <nav className="flex items-center justify-between bg-black px-8 py-5 text-white shadow-md">

      {/* LOGO */}

      <h1 className="text-2xl font-bold">
        Allo Inventory
      </h1>

      {/* BUTTONS */}

      <div className="flex items-center gap-4">

        <button
          onClick={handleLogout}
          className="rounded bg-red-600 px-5 py-2 hover:bg-red-700"
        >
          Logout
        </button>

      </div>

    </nav>
  );
}