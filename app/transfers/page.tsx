"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { supabase } from "@/lib/supabase";

export default function TransfersPage() {

  const [inventoryOptions, setInventoryOptions] =
    useState<any[]>([]);

  const [transfers, setTransfers] =
    useState<any[]>([]);

  const [selectedProduct, setSelectedProduct] =
    useState("");

  const [fromWarehouse, setFromWarehouse] =
    useState("");

  const [toWarehouse, setToWarehouse] =
    useState("");

  const [quantity, setQuantity] =
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
          `);

      if (error) {

        console.error(error);

        return;
      }

      setInventoryOptions(data || []);
    };

  /* =========================
     FETCH TRANSFERS
  ========================= */

  const fetchTransfers =
    async () => {

      const { data, error } =
        await supabase
          .from("stock_transfers")
          .select(`
            *,
            products(name)
          `)
          .order("id", {
            ascending: false,
          });

      if (error) {

        console.error(error);

        return;
      }

      setTransfers(data || []);
    };

  /* =========================
     TRANSFER STOCK
  ========================= */

  const transferStock =
    async () => {

      if (
        !selectedProduct ||
        !fromWarehouse ||
        !toWarehouse ||
        !quantity
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      if (
        fromWarehouse ===
        toWarehouse
      ) {

        alert(
          "Warehouses cannot be same"
        );

        return;
      }

      const qty =
        Number(quantity);

      /* =========================
         SOURCE INVENTORY
      ========================= */

      const sourceInventory =
        inventoryOptions.find(
          (item) =>
            item.product_id ===
              Number(
                selectedProduct
              ) &&
            item.warehouse_id ===
              Number(
                fromWarehouse
              )
        );

      if (!sourceInventory) {

        alert(
          "Source inventory not found"
        );

        return;
      }

      /* =========================
         VALIDATE STOCK
      ========================= */

      const availableStock =
        sourceInventory.total_stock -
        sourceInventory.reserved_stock;

      if (
        qty > availableStock
      ) {

        alert(
          "Insufficient stock"
        );

        return;
      }

      /* =========================
         DESTINATION INVENTORY
      ========================= */

      const destinationInventory =
        inventoryOptions.find(
          (item) =>
            item.product_id ===
              Number(
                selectedProduct
              ) &&
            item.warehouse_id ===
              Number(
                toWarehouse
              )
        );

      if (!destinationInventory) {

        alert(
          "Destination inventory not found"
        );

        return;
      }

      /* =========================
         UPDATE SOURCE
      ========================= */

      await supabase
        .from("inventory_table")
        .update({
          total_stock:
            sourceInventory.total_stock -
            qty,
        })
        .eq(
          "id",
          sourceInventory.id
        );

      /* =========================
         UPDATE DESTINATION
      ========================= */

      await supabase
        .from("inventory_table")
        .update({
          total_stock:
            destinationInventory.total_stock +
            qty,
        })
        .eq(
          "id",
          destinationInventory.id
        );

      /* =========================
         INSERT TRANSFER
      ========================= */

      await supabase
        .from("stock_transfers")
        .insert([
          {
            product_id:
              Number(
                selectedProduct
              ),

            from_warehouse_id:
              Number(
                fromWarehouse
              ),

            to_warehouse_id:
              Number(
                toWarehouse
              ),

            quantity: qty,

            transfer_status:
              "completed",
          },
        ]);

      /* =========================
         AUDIT LOG
      ========================= */

      const {
        data: {
          user,
        },
      } =
        await supabase.auth.getUser();

      await supabase
        .from("audit_logs")
        .insert([
          {
            action:
              "TRANSFER_CREATED",

            entity:
              "stock_transfer",

            entity_id:
              String(
                selectedProduct
              ),

            performed_by:
              user?.email ||
              "unknown",

            metadata: {
              quantity: qty,

              from_warehouse:
                fromWarehouse,

              to_warehouse:
                toWarehouse,
            },
          },
        ]);

      /* =========================
         REFRESH
      ========================= */

      fetchInventory();

      fetchTransfers();

      setSelectedProduct("");

      setFromWarehouse("");

      setToWarehouse("");

      setQuantity("");

      alert(
        "Stock transferred successfully"
      );
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchInventory();

    fetchTransfers();

    const channel =
      supabase
        .channel(
          "transfers-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "stock_transfers",
          },
          () => {

            fetchTransfers();

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

  /* =========================
     UNIQUE PRODUCTS
  ========================= */

  const uniqueProducts =
    Array.from(
      new Map(
        inventoryOptions.map(
          (item) => [
            item.product_id,
            item,
          ]
        )
      ).values()
    );

  /* =========================
     UNIQUE WAREHOUSES
  ========================= */

  const uniqueWarehouses =
    Array.from(
      new Map(
        inventoryOptions.map(
          (item) => [
            item.warehouse_id,
            item,
          ]
        )
      ).values()
    );

  return (
    <ProtectedRoute>

      <main className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex">

          <Sidebar />

          <div className="flex-1 p-10">

            <h1 className="text-4xl font-bold">
              Stock Transfers
            </h1>

            <p className="mt-2 text-gray-600">
              Transfer inventory between warehouses.
            </p>

            {/* FORM */}

            <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

              <h2 className="mb-6 text-2xl font-bold">
                Transfer Stock
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                {/* PRODUCT */}

                <select
                  value={selectedProduct}
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

                  {uniqueProducts.map(
                    (item: any) => (

                      <option
                        key={
                          item.product_id
                        }
                        value={
                          item.product_id
                        }
                      >

                        {
                          item.products?.name
                        }

                      </option>
                    )
                  )}

                </select>

                {/* FROM */}

                <select
                  value={fromWarehouse}
                  onChange={(e) =>
                    setFromWarehouse(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                >

                  <option value="">
                    From Warehouse
                  </option>

                  {uniqueWarehouses.map(
                    (item: any) => (

                      <option
                        key={
                          item.warehouse_id
                        }
                        value={
                          item.warehouse_id
                        }
                      >

                        {
                          item.warehouses?.name
                        }

                      </option>
                    )
                  )}

                </select>

                {/* TO */}

                <select
                  value={toWarehouse}
                  onChange={(e) =>
                    setToWarehouse(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                >

                  <option value="">
                    To Warehouse
                  </option>

                  {uniqueWarehouses.map(
                    (item: any) => (

                      <option
                        key={
                          item.warehouse_id
                        }
                        value={
                          item.warehouse_id
                        }
                      >

                        {
                          item.warehouses?.name
                        }

                      </option>
                    )
                  )}

                </select>

                {/* QUANTITY */}

                <input
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
                  className="rounded border p-3"
                />

              </div>

              {/* BUTTON */}

              <button
                onClick={
                  transferStock
                }
                className="mt-6 rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
              >
                Transfer Stock
              </button>

            </div>

          </div>

        </div>

      </main>

    </ProtectedRoute>
  );
}