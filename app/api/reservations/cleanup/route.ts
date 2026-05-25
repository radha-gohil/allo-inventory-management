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
   CLEANUP EXPIRED
========================= */

export async function POST() {

  try {

    /* =========================
       FIND EXPIRED
    ========================= */

    const {
      data: expiredReservations,
      error:
        reservationError,
    } =
      await supabase
        .from("reservations")
        .select("*")
        .eq(
          "status",
          "pending"
        )
        .lt(
          "expires_at",
          new Date().toISOString()
        );

    if (
      reservationError
    ) {

      return NextResponse.json(
        {
          error:
            "Failed to fetch expired reservations",
        },
        {
          status: 500,
        }
      );
    }

    /* =========================
       PROCESS EACH
    ========================= */

    for (const reservation of expiredReservations || []) {

      /* =========================
         FETCH INVENTORY
      ========================= */

      const {
        data: inventory,
      } =
        await supabase
          .from("inventory_table")
          .select("*")
          .eq(
            "id",
            reservation.inventory_id
          )
          .single();

      if (!inventory)
        continue;

      /* =========================
         RELEASE STOCK
      ========================= */

      const updatedReserved =
        Math.max(
          inventory.reserved_stock -
            reservation.reserved_quantity,
          0
        );

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

      /* =========================
         UPDATE STATUS
      ========================= */

      await supabase
        .from("reservations")
        .update({
          status:
            "expired",
        })
        .eq(
          "id",
          reservation.id
        );
    }

    /* =========================
       SUCCESS
    ========================= */

    return NextResponse.json(
      {
        success: true,

        cleaned:
          expiredReservations?.length ||
          0,
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