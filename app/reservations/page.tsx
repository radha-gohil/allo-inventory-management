"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import ReservationCountdown from "@/components/ReservationCountdown";

import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type Reservation = {
  id: number;

  inventory_id: number;

  reserved_quantity: number;

  status: string;

  expires_at?: string;

  inventory_table: any;
};

export default function ReservationsPage() {

  /* =========================
     STATES
  ========================= */

  const [reservations, setReservations] =
    useState<Reservation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [inventoryOptions, setInventoryOptions] =
    useState<any[]>([]);

  const [selectedInventory, setSelectedInventory] =
    useState("");

  const [reserveQuantity, setReserveQuantity] =
    useState("");

  /* =========================
     FETCH INVENTORY
  ========================= */

  const fetchInventoryOptions =
    async () => {

      const { data, error } =
        await supabase
          .from("inventory_table")
          .select(`
            id,
            total_stock,
            reserved_stock,

            products (
              name
            ),

            warehouses (
              name
            )
          `);

      if (error) {

        console.error(error);

        return;
      }

      setInventoryOptions(
        data || []
      );
    };

  /* =========================
     FETCH RESERVATIONS
  ========================= */

  const fetchReservations =
    async () => {

      const { data, error } =
        await supabase
          .from("reservations")
          .select(`
            id,
            inventory_id,
            reserved_quantity,
            status,
            expires_at,

            inventory_table (
              id,
              total_stock,
              reserved_stock,

              products (
                name
              ),

              warehouses (
                name
              )
            )
          `)
          .order("id", {
            ascending: false,
          });

      if (error) {

        console.error(error);

        setLoading(false);

        return;
      }

      setReservations(
        data || []
      );

      setLoading(false);
    };

  /* =========================
     CREATE RESERVATION
  ========================= */

  const createReservation =
    async () => {

      if (
        !selectedInventory ||
        !reserveQuantity
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      try {

        const response =
          await fetch(
            "/api/reservations",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                inventory_id:
                  Number(
                    selectedInventory
                  ),

                quantity:
                  Number(
                    reserveQuantity
                  ),
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {

          alert(
            result.error
          );

          return;
        }

        alert(
          "Reservation created successfully"
        );

        setSelectedInventory("");

        setReserveQuantity("");

      } catch (error) {

        console.error(error);

        alert(
          "Reservation failed"
        );
      }
    };

  /* =========================
     CONFIRM RESERVATION
  ========================= */

  const confirmReservation =
    async (
      reservationId: number
    ) => {

      try {

        const response =
          await fetch(
            "/api/reservations/confirm",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                reservation_id:
                  reservationId,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {

          alert(
            result.error
          );

          return;
        }

        alert(
          "Reservation confirmed"
        );

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================
     RELEASE RESERVATION
  ========================= */

  const releaseReservation =
    async (
      reservationId: number
    ) => {

      try {

        const response =
          await fetch(
            "/api/reservations/release",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                reservation_id:
                  reservationId,
              }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {

          alert(
            result.error
          );

          return;
        }

        alert(
          "Reservation released"
        );

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================
     INITIAL LOAD + REALTIME
  ========================= */

  useEffect(() => {

    fetchReservations();

    fetchInventoryOptions();

    /* =========================
       AUTO CLEANUP
    ========================= */

    const cleanupInterval =
      setInterval(
        async () => {

          try {

            await fetch(
              "/api/reservations/cleanup",
              {
                method: "POST",
              }
            );

          } catch (error) {

            console.error(error);
          }

        },
        30000
      );

    /* =========================
       RESERVATION REALTIME
    ========================= */

    const reservationChannel =
      supabase
        .channel(
          "reservations-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "reservations",
          },
          () => {

            fetchReservations();
          }
        )
        .subscribe();

    /* =========================
       INVENTORY REALTIME
    ========================= */

    const inventoryChannel =
      supabase
        .channel(
          "inventory-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "inventory_table",
          },
          () => {

            fetchInventoryOptions();
          }
        )
        .subscribe();

    return () => {

      clearInterval(
        cleanupInterval
      );

      supabase.removeChannel(
        reservationChannel
      );

      supabase.removeChannel(
        inventoryChannel
      );
    };

  }, []);

  return (
    <ProtectedRoute>

      <main className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex">

          <Sidebar />

          <div className="flex-1 p-10">

            {/* HEADER */}

            <h1 className="text-4xl font-bold">
              Reservations
            </h1>

            <p className="mt-2 text-gray-600">
              Real-time reservation system.
            </p>

            {/* CREATE FORM */}

            <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

              <h2 className="mb-6 text-2xl font-bold">
                Create Reservation
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* INVENTORY */}

                <select
                  value={selectedInventory}
                  onChange={(e) =>
                    setSelectedInventory(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                >

                  <option value="">
                    Select Inventory
                  </option>

                  {inventoryOptions.map(
                    (item) => (

                      <option
                        key={item.id}
                        value={item.id}
                      >

                        {
                          item.products?.name
                        }

                        {" - "}

                        {
                          item.warehouses?.name
                        }

                        {" (Available: "}

                        {
                          item.total_stock -
                          item.reserved_stock
                        }

                        {")"}

                      </option>
                    )
                  )}

                </select>

                {/* QUANTITY */}

                <input
                  type="number"
                  placeholder="Quantity"
                  value={reserveQuantity}
                  onChange={(e) =>
                    setReserveQuantity(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                />

                {/* BUTTON */}

                <button
                  onClick={
                    createReservation
                  }
                  className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
                >
                  Reserve Stock
                </button>

              </div>

            </div>

            {/* TABLE */}

            {loading ? (

              <p className="mt-10 text-lg">
                Loading reservations...
              </p>

            ) : (

              <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

                <h2 className="mb-6 text-2xl font-bold">
                  Reservation List
                </h2>

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b text-left">

                      <th className="p-4">
                        Product
                      </th>

                      <th className="p-4">
                        Warehouse
                      </th>

                      <th className="p-4">
                        Quantity
                      </th>

                      <th className="p-4">
                        Status
                      </th>

                      <th className="p-4">
                        Countdown
                      </th>

                      <th className="p-4">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {reservations.map(
                      (
                        reservation
                      ) => (

                        <tr
                          key={
                            reservation.id
                          }
                          className="border-b"
                        >

                          {/* PRODUCT */}

                          <td className="p-4">

                            {
                              reservation
                                .inventory_table
                                ?.products?.name
                            }

                          </td>

                          {/* WAREHOUSE */}

                          <td className="p-4">

                            {
                              reservation
                                .inventory_table
                                ?.warehouses?.name
                            }

                          </td>

                          {/* QUANTITY */}

                          <td className="p-4 font-bold text-orange-600">

                            {
                              reservation
                                .reserved_quantity
                            }

                          </td>

                          {/* STATUS */}

                          <td className="p-4">

                            <span
                              className={`rounded px-3 py-1 ${
                                reservation.status ===
                                "confirmed"
                                  ? "bg-green-100 text-green-700"
                                  : reservation.status ===
                                    "released"
                                  ? "bg-red-100 text-red-700"
                                  : reservation.status ===
                                    "expired"
                                  ? "bg-gray-200 text-gray-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >

                              {
                                reservation.status
                              }

                            </span>

                          </td>

                          {/* COUNTDOWN */}

                          <td className="p-4">

                            {reservation.expires_at ? (

                              <ReservationCountdown
                                expiresAt={
                                  reservation.expires_at
                                }
                              />

                            ) : (

                              "N/A"

                            )}

                          </td>

                          {/* ACTIONS */}

                          <td className="flex gap-3 p-4">

                            {reservation.status ===
                              "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    confirmReservation(
                                      reservation.id
                                    )
                                  }
                                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                  Confirm
                                </button>

                                <button
                                  onClick={() =>
                                    releaseReservation(
                                      reservation.id
                                    )
                                  }
                                  className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                >
                                  Release
                                </button>
                              </>
                            )}

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </main>

    </ProtectedRoute>
  );
}