"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import ProductTable from "@/components/ProductTable";
import AddProductForm from "@/components/AddProductForm";

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

export default function ProductsPage() {

  /* =========================
     STATES
  ========================= */

  const [products, setProducts] =
    useState<Product[]>([]);

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null);

  const [userRole, setUserRole] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH USER ROLE
  ========================= */

  const fetchUserRole =
    async () => {

      try {

        const response =
          await fetch(
            "/api/profile"
          );

        const result =
          await response.json();

        if (
          result.success
        ) {

          setUserRole(
            result.role
          );
        }

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================
     FETCH PRODUCTS
  ========================= */

  const fetchProducts =
    async () => {

      try {

        const response =
          await fetch(
            "/api/products"
          );

        const result =
          await response.json();

        if (!response.ok) {

          console.error(
            result.error
          );

          setLoading(false);

          return;
        }

        setProducts(
          result.products || []
        );

        setLoading(false);

      } catch (error) {

        console.error(error);

        setLoading(false);
      }
    };

  /* =========================
     INITIAL LOAD
  ========================= */

  useEffect(() => {

    fetchProducts();

    fetchUserRole();

  }, []);

  /* =========================
     ADD PRODUCT
  ========================= */

  const addProduct =
    async (
      name: string,
      stock: number
    ) => {

      try {

        const response =
          await fetch(
            "/api/products",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name,
                stock,
                price: 100,
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
          "Product added successfully"
        );

        fetchProducts();

      } catch (error) {

        console.error(error);

        alert(
          "Failed to add product"
        );
      }
    };

  /* =========================
     DELETE PRODUCT
  ========================= */

  const deleteProduct =
    async (
      id: number
    ) => {

      try {

        const response =
          await fetch(
            `/api/products/${id}`,
            {
              method: "DELETE",
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
          "Product deleted"
        );

        fetchProducts();

      } catch (error) {

        console.error(error);
      }
    };

  /* =========================
     UPDATE PRODUCT
  ========================= */

  const updateProduct =
    async (
      updatedProduct: Product
    ) => {

      try {

        const response =
          await fetch(
            `/api/products/${updatedProduct.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                name:
                  updatedProduct.name,

                stock:
                  updatedProduct.stock,

                price:
                  updatedProduct.price,
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
          "Product updated"
        );

        fetchProducts();

        setEditingProduct(
          null
        );

      } catch (error) {

        console.error(error);
      }
    };

  return (
    <ProtectedRoute>

      <main className="min-h-screen bg-gray-100">

        <Navbar />

        <div className="flex">

          <Sidebar />

          <div className="flex-1 p-10">

            {/* HEADER */}

            <h1 className="text-4xl font-bold">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Product management system.
            </p>

            {/* TABLE */}

            {loading ? (

              <p className="mt-10 text-lg">
                Loading products...
              </p>

            ) : (

              <ProductTable
                products={products}
                deleteProduct={
                  deleteProduct
                }
                setEditingProduct={
                  setEditingProduct
                }
                userRole={
                  userRole
                }
              />

            )}

            {/* FORM */}

            <AddProductForm
              addProduct={
                addProduct
              }
              editingProduct={
                editingProduct
              }
              updateProduct={
                updateProduct
              }
            />

          </div>

        </div>

      </main>

    </ProtectedRoute>
  );
}