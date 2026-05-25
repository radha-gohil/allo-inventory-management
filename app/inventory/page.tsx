"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type Product = {
  id: number;
  name: string;
};

type Warehouse = {
  id: number;
  name: string;
};

type Inventory = {
  id: number;

  product_id: number;

  warehouse_id: number;

  total_stock: number;

  reserved_stock: number;

  products: {
    name: string;
  };

  warehouses: {
    name: string;
  };
};

export default function InventoryPage() {

  /* =========================
     STATES
  ========================= */

  const [inventory, setInventory] =
    useState<Inventory[]>([]);

  const [products, setProducts] =
    useState<Product[]>([]);

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [selectedWarehouse, setSelectedWarehouse] =
    useState("");

  const [stock, setStock] =
    useState("");

  /* =========================
     FETCH INVENTORY
  ========================= */

  const fetchInventory =
    async () => {

      const { data, error } =
        await supabase
          .from("inventory_table")
          .select(`
            *,
            products(name),
            warehouses(name)
          `)
          .order("id", {
            ascending: true,
          });

      if (error) {

        console.error(error);

        setLoading(false);

        return;
      }

      setInventory(data || []);

      setLoading(false);
    };

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts =
    async () => {

      const { data, error } =
        await supabase
          .from("products")
          .select("id,name");

      if (error) {

        console.error(error);

        return;
      }

      setProducts(data || []);
    };

  /* =========================
     FETCH WAREHOUSES
  ========================= */

  const fetchWarehouses =
    async () => {

      const { data, error } =
        await supabase
          .from("warehouses")
          .select("id,name");

      if (error) {

        console.error(error);

        return;
      }

      setWarehouses(data || []);
    };

  /* =========================
     CREATE INVENTORY
  ========================= */

  const createInventory =
    async () => {

      if (
        !selectedProduct ||
        !selectedWarehouse ||
        !stock
      ) {

        alert(
          "Fill all fields"
        );

        return;
      }

      const { error } =
        await supabase
          .from("inventory_table")
          .insert([
            {
              product_id:
                Number(
                  selectedProduct
                ),

              warehouse_id:
                Number(
                  selectedWarehouse
                ),

              total_stock:
                Number(stock),

              reserved_stock: 0,
            },
          ]);

      if (error) {

        console.error(error);

        alert(
          "Inventory creation failed"
        );

        return;
      }

      alert(
        "Inventory created"
      );

      setSelectedProduct("");

      setSelectedWarehouse("");

      setStock("");

      fetchInventory();
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchInventory();

    fetchProducts();

    fetchWarehouses();

    /* =========================
       REALTIME
    ========================= */

    const channel =
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

            fetchInventory();
          }
        )
        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
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
              Inventory
            </h1>

            <p className="mt-2 text-gray-600">
              Inventory management page.
            </p>

            {/* CREATE FORM */}

            <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

              <h2 className="mb-6 text-2xl font-bold">
                Create Inventory
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                {/* PRODUCT */}

                <select
                  value={
                    selectedProduct
                  }
                  onChange={(e) =>
                    setSelectedProduct(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                >

                  <option value="">
                    Select Product
                  </option>

                  {products.map(
                    (product) => (

                      <option
                        key={
                          product.id
                        }
                        value={
                          product.id
                        }
                      >

                        {product.name}

                      </option>
                    )
                  )}

                </select>

                {/* WAREHOUSE */}

                <select
                  value={
                    selectedWarehouse
                  }
                  onChange={(e) =>
                    setSelectedWarehouse(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                >

                  <option value="">
                    Select Warehouse
                  </option>

                  {warehouses.map(
                    (warehouse) => (

                      <option
                        key={
                          warehouse.id
                        }
                        value={
                          warehouse.id
                        }
                      >

                        {warehouse.name}

                      </option>
                    )
                  )}

                </select>

                {/* STOCK */}

                <input
                  type="number"
                  placeholder="Total Stock"
                  value={stock}
                  onChange={(e) =>
                    setStock(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                />

                {/* BUTTON */}

                <button
                  onClick={
                    createInventory
                  }
                  className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
                >
                  Create Inventory
                </button>

              </div>

            </div>

            {/* TABLE */}

            {loading ? (

              <p className="mt-10 text-lg">
                Loading inventory...
              </p>

            ) : (

              <div className="mt-10 rounded-xl bg-white p-6 shadow">

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
                        Total Stock
                      </th>

                      <th className="p-4">
                        Reserved
                      </th>

                      <th className="p-4">
                        Available
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {inventory.map(
                      (item) => (

                        <tr
                          key={item.id}
                          className="border-b"
                        >

                          <td className="p-4">
                            {
                              item.products
                                .name
                            }
                          </td>

                          <td className="p-4">
                            {
                              item.warehouses
                                .name
                            }
                          </td>

                          <td className="p-4">
                            {
                              item.total_stock
                            }
                          </td>

                          <td className="p-4">
                            {
                              item.reserved_stock
                            }
                          </td>

                          <td className="p-4 font-bold text-green-600">

                            {
                              item.total_stock -
                              item.reserved_stock
                            }

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