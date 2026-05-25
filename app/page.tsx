"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import DashboardCard from "@/components/DashboardCard";
import ProductTable from "@/components/ProductTable";
import AddProductForm from "@/components/AddProductForm";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";

import { supabase } from "@/lib/supabase";

/* =========================
   PRODUCT TYPE
========================= */

export type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  sku: string;
  created_at?: string;
};

/* =========================
   WAREHOUSE TYPE
========================= */

export type Warehouse = {
  id: number;
  name: string;
  city: string;
  created_at?: string;
};

export default function Home() {

  /* =========================
     PRODUCT STATE
  ========================= */

  const [products, setProducts] =
    useState<Product[]>([]);

  /* =========================
     WAREHOUSE STATE
  ========================= */

  const [warehouses, setWarehouses] =
    useState<Warehouse[]>([]);

  /* =========================
     INVENTORY ANALYTICS
  ========================= */

  const [inventoryData, setInventoryData] =
    useState<any[]>([]);

  /* =========================
     EDITING STATE
  ========================= */

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  /* =========================
     LOADING
  ========================= */

  const [loading, setLoading] =
    useState(false);

  /* =========================
     SEARCH
  ========================= */

  const [searchTerm, setSearchTerm] =
    useState("");

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts = async () => {

    setLoading(true);

    const { data, error } =
      await supabase
        .from("products")
        .select("*")
        .order("id", {
          ascending: true,
        });

    if (error) {

      console.error(error);

      setLoading(false);

      return;
    }

    setProducts(data || []);

    setLoading(false);
  };

  /* =========================
     FETCH WAREHOUSES
  ========================= */

  const fetchWarehouses =
    async () => {

      const { data, error } =
        await supabase
          .from("warehouses")
          .select("*");

      if (error) {

        console.error(error);

        return;
      }

      setWarehouses(data || []);
    };

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
            warehouses(name)
          `);

      if (error) {

        console.error(error);

        return;
      }

      setInventoryData(data || []);
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchProducts();

    fetchWarehouses();

    fetchInventory();

  }, []);

  /* =========================
     ADD PRODUCT
  ========================= */

  const addProduct = async (
    name: string,
    stock: number
  ) => {

    const { error } =
      await supabase
        .from("products")
        .insert([
          {
            name,
            stock,
            price: 100,
            sku: `SKU-${Date.now()}`,
          },
        ]);

    if (error) {

      console.error(error);

      return;
    }

    fetchProducts();
  };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct = async (
    id: number
  ) => {

    const { error } =
      await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {

      console.error(error);

      return;
    }

    fetchProducts();
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */

  const updateProduct = async (
    updatedProduct: Product
  ) => {

    const { error } =
      await supabase
        .from("products")
        .update({
          name: updatedProduct.name,
          stock: updatedProduct.stock,
          price: updatedProduct.price,
        })
        .eq("id", updatedProduct.id);

    if (error) {

      console.error(error);

      return;
    }

    fetchProducts();

    setEditingProduct(null);
  };

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    );

  return (
    <main className="min-h-screen bg-gray-100">

      {/* =========================
          NAVBAR
      ========================= */}

      <Navbar />

      {/* =========================
          MAIN LAYOUT
      ========================= */}

      <div className="flex">

        {/* SIDEBAR */}

        <Sidebar />

        {/* =========================
            MAIN CONTENT
        ========================= */}

        <div className="flex-1 p-10">

          {/* HEADER */}

          <h1 className="text-4xl font-bold">
            Inventory Dashboard
          </h1>

          <p className="mt-3 text-gray-600">
            Manage products,
            warehouses, inventory,
            transfers and analytics.
          </p>

          {/* =========================
              DASHBOARD CARDS
          ========================= */}

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">

            <DashboardCard
              title="Total Products"
              value={
                products.length.toString()
              }
            />

            <DashboardCard
              title="Total Warehouses"
              value={
                warehouses.length.toString()
              }
            />

            <DashboardCard
              title="Low Stock"
              value={
                products
                  .filter(
                    (product) =>
                      product.stock < 10
                  )
                  .length.toString()
              }
            />

          </div>

          {/* =========================
              SEARCH BAR
          ========================= */}

          <div className="mt-8">

            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          {/* =========================
              PRODUCT TABLE
          ========================= */}

          {loading ? (

            <p className="mt-6 text-lg">
              Loading products...
            </p>

          ) : (

            <ProductTable
              products={filteredProducts}
              deleteProduct={
                deleteProduct
              }
              setEditingProduct={
                setEditingProduct
              }
              userRole="admin"
            />

          )}

          {/* =========================
              ADD PRODUCT FORM
          ========================= */}

          <AddProductForm
            addProduct={addProduct}
            editingProduct={
              editingProduct
            }
            updateProduct={
              updateProduct
            }
          />

          {/* =========================
              ANALYTICS DASHBOARD
          ========================= */}

          <AnalyticsDashboard
            inventoryData={
              inventoryData
            }
          />

          {/* =========================
              WAREHOUSE TABLE
          ========================= */}

          <div className="mt-10 rounded-xl bg-white p-6 shadow">

            <h2 className="mb-6 text-3xl font-bold">
              Warehouses
            </h2>

            <table className="w-full border-collapse">

              <thead>

                <tr className="border-b text-left">

                  <th className="p-4">
                    ID
                  </th>

                  <th className="p-4">
                    Warehouse Name
                  </th>

                  <th className="p-4">
                    City
                  </th>

                  <th className="p-4">
                    Created At
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

                      <td className="p-4">

                        {warehouse.created_at
                          ? new Date(
                              warehouse.created_at
                            ).toLocaleString()
                          : "N/A"}

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}