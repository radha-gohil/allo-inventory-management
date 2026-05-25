import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@supabase/supabase-js";

/* =========================
   SUPABASE
========================= */

const supabase =
  createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

/* =========================
   GET PROFILE
========================= */

export async function GET() {

  try {

    /*
      TEMP STATIC ROLE
    */

    return NextResponse.json(
      {
        success: true,

        role: "admin",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
  }
}