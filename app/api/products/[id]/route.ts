import { NextRequest, NextResponse } from "next/server";

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
   UPDATE PRODUCT
========================= */

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const body =
      await request.json();

    const {
      name,
      stock,
      price,
    } = body;

    const {
      error,
    } =
      await supabase
        .from("products")
        .update({
          name,
          stock,
          price,
        })
        .eq("id", id);

    if (error) {

      return NextResponse.json(
        {
          error:
            "Update failed",
        },
        {
          status: 500,
        }
      );
    }

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

/* =========================
   DELETE PRODUCT
========================= */

export async function DELETE(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {

  try {

    const { id } =
      await context.params;

    const {
      error,
    } =
      await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {

      return NextResponse.json(
        {
          error:
            "Delete failed",
        },
        {
          status: 500,
        }
      );
    }

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