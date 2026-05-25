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
   RELEASE RESERVATION
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
       UPDATE INVENTORY
    ========================= */

    const {
      data: inventory,
      error:
        inventoryError,
    } =
      await supabase
        .from("inventory_table")
        .select("*")
        .eq(
          "id",
          reservation.inventory_id
        )
        .single();

    if (
      inventoryError ||
      !inventory
    ) {

      return NextResponse.json(
        {
          error:
            "Inventory not found",
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       RELEASE STOCK
    ========================= */

    const updatedReserved =
      Math.max(
        inventory.reserved_stock -
          reservation.reserved_quantity,
        0
      );

    const {
      error: stockError,
    } =
      await supabase
        .from("inventory_table")
        .update({
          reserved_stock:
            updatedReserved,
        })
        .eq(
          "id",
          reservation.inventory_id
        );

    if (stockError) {

      return NextResponse.json(
        {
          error:
            "Stock release failed",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       UPDATE RESERVATION
    ========================= */

    const {
      error: updateError,
    } =
      await supabase
        .from("reservations")
        .update({
          status:
            "released",
        })
        .eq(
          "id",
          reservation_id
        );

    if (updateError) {

      return NextResponse.json(
        {
          error:
            "Release failed",
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