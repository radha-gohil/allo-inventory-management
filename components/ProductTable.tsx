"use client";

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  sku: string;
  created_at?: string;
};

type ProductTableProps = {
  products: Product[];

  userRole: string;

  deleteProduct: (
    id: number
  ) => void;

  setEditingProduct: (
    product: Product
  ) => void;
};

export default function ProductTable({
  products,
  deleteProduct,
  setEditingProduct,
  userRole,
}: ProductTableProps) {

  return (
    <div className="mt-10 rounded-xl bg-white p-6 shadow-md">

      <h2 className="mb-6 text-2xl font-bold">
        Product List
      </h2>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b text-left">

            <th className="p-4">
              ID
            </th>

            <th className="p-4">
              Product
            </th>

            <th className="p-4">
              Stock
            </th>

            <th className="p-4">
              Price
            </th>

            <th className="p-4">
              SKU
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-b"
            >

              <td className="p-4">
                {product.id}
              </td>

              <td className="p-4">
                {product.name}
              </td>

              <td className="p-4">
                {product.stock}
              </td>

              <td className="p-4">
                ${product.price}
              </td>

              <td className="p-4">
                {product.sku}
              </td>

              {/* ACTIONS */}

              <td className="flex gap-3 p-4">

                {userRole === "admin" && (
                  <>
                    <button
                      onClick={() =>
                        setEditingProduct(
                          product
                        )
                      }
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product.id
                        )
                      }
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}

                {userRole !== "admin" && (
                  <span className="text-gray-500">
                    Read Only
                  </span>
                )}

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}