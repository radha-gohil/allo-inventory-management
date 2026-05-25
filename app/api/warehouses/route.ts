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
   GET WAREHOUSES
========================= */

export async function GET() {

  try {

    const {
      data,
      error,
    } =
      await supabase
        .from("warehouses")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Failed to fetch warehouses",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        warehouses: data,
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

/* =========================
   CREATE WAREHOUSE
========================= */

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      name,
      city,
    } = body;

    /* VALIDATION */

    if (
      !name ||
      !city
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

    /* INSERT */

    const {
      data,
      error,
    } =
      await supabase
        .from("warehouses")
        .insert([
          {
            name,
            city,
          },
        ])
        .select()
        .single();

    if (error) {

      return NextResponse.json(
        {
          error:
            "Warehouse creation failed",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,

        warehouse: data,
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