"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { supabase } from "@/lib/supabase";

type Warehouse = {
  id: number;

  name: string;

  city: string;
};

export default function WarehousesPage() {

  /* =========================
     STATES
  ========================= */

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [name, setName] =
    useState("");

  const [city, setCity] =
    useState("");

  /* =========================
     FETCH WAREHOUSES
  ========================= */

  const fetchWarehouses =
    async () => {

      const { data, error } =
        await supabase
          .from("warehouses")
          .select("*")
          .order("id", {
            ascending: true,
          });

      if (error) {

        console.error(error);

        setLoading(false);

        return;
      }

      setWarehouses(data || []);

      setLoading(false);
    };

  /* =========================
     CREATE WAREHOUSE
  ========================= */

  const createWarehouse =
    async () => {

      if (!name || !city) {

        alert(
          "Fill all fields"
        );

        return;
      }

      const { error } =
        await supabase
          .from("warehouses")
          .insert([
            {
              name,
              city,
            },
          ]);

      if (error) {

        console.error(error);

        alert(
          "Warehouse creation failed"
        );

        return;
      }

      alert(
        "Warehouse created"
      );

      setName("");

      setCity("");

      fetchWarehouses();
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchWarehouses();

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
              Warehouses
            </h1>

            <p className="mt-2 text-gray-600">
              Warehouse management page.
            </p>

            {/* CREATE FORM */}

            <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

              <h2 className="mb-6 text-2xl font-bold">
                Create Warehouse
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                <input
                  type="text"
                  placeholder="Warehouse Name"
                  value={name}
                  onChange={(e) =>
                    setName(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                />

                <button
                  onClick={
                    createWarehouse
                  }
                  className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
                >
                  Create Warehouse
                </button>

              </div>

            </div>

            {/* TABLE */}

            {loading ? (

              <p className="mt-10 text-lg">
                Loading warehouses...
              </p>

            ) : (

              <div className="mt-10 rounded-xl bg-white p-6 shadow">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b text-left">

                      <th className="p-4">
                        ID
                      </th>

                      <th className="p-4">
                        Warehouse
                      </th>

                      <th className="p-4">
                        City
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {warehouses.map(
                      (warehouse) => (

                        <tr
                          key={warehouse.id}
                          className="border-b"
                        >

                          <td className="p-4">
                            {warehouse.id}
                          </td>

                          <td className="p-4">
                            {warehouse.name}
                          </td>

                          <td className="p-4">
                            {warehouse.city}
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