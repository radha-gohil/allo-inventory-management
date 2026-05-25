import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE ADMIN CLIENT
========================= */

const supabase =
  createClient(
    process.env
      .NEXT_PUBLIC_SUPABASE_URL!,
    process.env
      .SUPABASE_SERVICE_ROLE_KEY!
  );

/* =========================
   CREATE RESERVATION
========================= */

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      inventory_id,
      quantity,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (
      !inventory_id ||
      !quantity
    ) {

      return NextResponse.json(
        {
          error:
            "Missing fields",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       RPC TRANSACTION
    ========================= */

    const {
      data,
      error,
    } =
      await supabase.rpc(
        "create_reservation_transaction",
        {
          p_inventory_id:
            inventory_id,

          p_quantity:
            quantity,
        }
      );

    /* =========================
       RPC ERROR
    ========================= */

    if (error) {

      console.error(error);

      return NextResponse.json(
        {
          error:
            "Reservation failed",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       BUSINESS FAILURE
    ========================= */

    if (!data.success) {

      return NextResponse.json(
        {
          error:
            data.error,
        },
        {
          status: 409,
        }
      );
    }

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.json(
      {
        success: true,

        reservation_id:
          data.reservation_id,

        expires_at:
          data.expires_at,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}