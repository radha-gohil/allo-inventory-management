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
   GET PRODUCTS
========================= */

export async function GET() {

  try {

    const {
      data,
      error,
    } =
      await supabase
        .from("products")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (error) {

      return NextResponse.json(
        {
          error:
            "Failed to fetch products",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        products: data,
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
   CREATE PRODUCT
========================= */

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();

    const {
      name,
      stock,
      price,
    } = body;

    /* VALIDATION */

    if (
      !name ||
      stock === undefined
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
        .from("products")
        .insert([
          {
            name,

            stock,

            price:
              price || 100,

            sku:
              `SKU-${Date.now()}`,
          },
        ])
        .select()
        .single();

    if (error) {

      return NextResponse.json(
        {
          error:
            "Product creation failed",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        product: data,
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