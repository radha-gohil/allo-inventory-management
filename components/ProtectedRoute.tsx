"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

type Props = {
  children:
    React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {

  const router =
    useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: {
            session,
          },
        } =
          await supabase.auth.getSession();

        if (!session) {

          router.push(
            "/login"
          );

          return;
        }

        setLoading(false);
      };

    checkUser();

  }, [router]);

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center text-2xl font-bold">

        Loading...

      </div>
    );
  }

  return <>{children}</>;
}