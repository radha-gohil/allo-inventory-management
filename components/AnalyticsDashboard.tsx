"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Props = {
  inventoryData: any[];
};

export default function AnalyticsDashboard({
  inventoryData,
}: Props) {

  /* =========================
     LOW STOCK
  ========================= */

  const lowStock =
    inventoryData.filter(
      (item) =>
        item.total_stock < 20
    );

  /* =========================
     TOTAL STOCK
  ========================= */

  const totalStock =
    inventoryData.reduce(
      (sum, item) =>
        sum + item.total_stock,
      0
    );

  /* =========================
     RESERVED STOCK
  ========================= */

  const reservedStock =
    inventoryData.reduce(
      (sum, item) =>
        sum + item.reserved_stock,
      0
    );

  /* =========================
     BAR CHART DATA
  ========================= */

  const chartData =
    inventoryData.map(
      (item) => ({
        warehouse:
          item.warehouses?.[0]
            ?.name || "Unknown",

        stock:
          item.total_stock,
      })
    );

  /* =========================
     PIE DATA
  ========================= */

  const pieData = [
    {
      name: "Available",
      value:
        totalStock -
        reservedStock,
    },

    {
      name: "Reserved",
      value: reservedStock,
    },
  ];

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <div className="grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-gray-500">
            Total Stock
          </h2>

          <p className="mt-2 text-4xl font-bold">
            {totalStock}
          </p>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-gray-500">
            Reserved Stock
          </h2>

          <p className="mt-2 text-4xl font-bold text-orange-600">
            {reservedStock}
          </p>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-gray-500">
            Low Stock Alerts
          </h2>

          <p className="mt-2 text-4xl font-bold text-red-600">
            {lowStock.length}
          </p>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-gray-500">
            Warehouses
          </h2>

          <p className="mt-2 text-4xl font-bold text-blue-600">
            {chartData.length}
          </p>

        </div>

      </div>

      {/* =========================
          BAR CHART
      ========================= */}

      <div className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-4 text-2xl font-bold">
          Warehouse Stock
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={chartData}>

            <XAxis dataKey="warehouse" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="stock" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* =========================
          PIE CHART
      ========================= */}

      <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">

        <h2 className="mb-4 text-2xl font-bold">
          Inventory Allocation
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >

              <Cell />

              <Cell />

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}