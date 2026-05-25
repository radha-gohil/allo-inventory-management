import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

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
   CONFIRM RESERVATION
========================= */

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      reservation_id,
    } = body;

    /* =========================
       VALIDATION
    ========================= */

    if (!reservation_id) {

      return NextResponse.json(
        {
          error:
            "Reservation ID required",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FETCH RESERVATION
    ========================= */

    const {
      data: reservation,
      error:
        reservationError,
    } =
      await supabase
        .from("reservations")
        .select("*")
        .eq(
          "id",
          reservation_id
        )
        .single();

    if (
      reservationError ||
      !reservation
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       EXPIRED CHECK
    ========================= */

    if (
      reservation.expires_at &&
      new Date(
        reservation.expires_at
      ) < new Date()
    ) {

      return NextResponse.json(
        {
          error:
            "Reservation expired",
        },
        {
          status: 410,
        }
      );
    }

    /* =========================
       UPDATE STATUS
    ========================= */

    const {
      error: updateError,
    } =
      await supabase
        .from("reservations")
        .update({
          status:
            "confirmed",
        })
        .eq(
          "id",
          reservation_id
        );

    if (updateError) {

      return NextResponse.json(
        {
          error:
            "Confirmation failed",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.json(
      {
        success: true,
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
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}