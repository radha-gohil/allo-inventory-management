"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  Package,
  Boxes,
  Warehouse,
  ClipboardList,
  ArrowRightLeft,
  FileText,
} from "lucide-react";

export default function Sidebar() {

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: LayoutDashboard,
    },

    {
      name: "Products",
      href: "/products",
      icon: Package,
    },

    {
      name: "Warehouses",
      href: "/warehouses",
      icon: Warehouse,
    },

    {
      name: "Inventory",
      href: "/inventory",
      icon: Boxes,
    },

    {
      name: "Reservations",
      href: "/reservations",
      icon: ClipboardList,
    },

    {
      name: "Transfers",
      href: "/transfers",
      icon: ArrowRightLeft,
    },

    {
      name: "Audit Logs",
      href: "/audit-logs",
      icon: FileText,
    },
  ];

  return (
    <aside className="min-h-screen w-72 bg-gradient-to-b from-gray-950 to-gray-900 p-6 text-white shadow-2xl">

      {/* =========================
          LOGO
      ========================= */}

      <div className="mb-10">

        <h1 className="text-4xl font-extrabold tracking-wide">
          Allo
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Inventory Management
        </p>

      </div>

      {/* =========================
          NAVIGATION
      ========================= */}

      <nav className="flex flex-col gap-3">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 rounded-xl p-4 transition-all duration-200 hover:bg-gray-800 hover:text-white"
            >

              {/* ICON */}

              <Icon size={22} />

              {/* TEXT */}

              <span className="text-lg font-medium">

                {item.name}

              </span>

            </Link>
          );
        })}

      </nav>

      {/* =========================
          SYSTEM STATUS
      ========================= */}

      <div className="mt-16 rounded-2xl bg-gray-800 p-5">

        <h2 className="text-lg font-bold">
          System Status
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          Inventory services are operational.
        </p>

        <div className="mt-4 flex items-center gap-2">

          <div className="h-3 w-3 rounded-full bg-green-500"></div>

          <span className="text-sm">
            Online
          </span>

        </div>

      </div>

    </aside>
  );
}