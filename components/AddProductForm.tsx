"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  sku: string;
  created_at?: string;
};

type AddProductFormProps = {
  addProduct: (
    name: string,
    stock: number
  ) => void;

  editingProduct: Product | null;

  updateProduct: (
    product: Product
  ) => void;
};

export default function AddProductForm({
  addProduct,
  editingProduct,
  updateProduct,
}: AddProductFormProps) {

  const [productName, setProductName] =
    useState("");

  const [stock, setStock] =
    useState("");

  useEffect(() => {

    if (editingProduct) {

      setProductName(
        editingProduct.name
      );

      setStock(
        editingProduct.stock.toString()
      );
    }

  }, [editingProduct]);

  const handleSubmit = (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!productName || !stock)
      return;

    if (editingProduct) {

      updateProduct({
        ...editingProduct,
        name: productName,
        stock: Number(stock),
      });

    } else {

      addProduct(
        productName,
        Number(stock)
      );
    }

    setProductName("");

    setStock("");
  };

  return (
    <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

      <h2 className="mb-4 text-2xl font-bold">

        {editingProduct
          ? "Edit Product"
          : "Add Product"}

      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) =>
            setProductName(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          value={stock}
          onChange={(e) =>
            setStock(
              e.target.value
            )
          }
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          className="rounded bg-black px-6 py-3 text-white"
        >

          {editingProduct
            ? "Update Product"
            : "Add Product"}

        </button>

      </form>

    </div>
  );
}