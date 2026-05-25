"use client";

import { useEffect, useState } from "react";

import ProtectedRoute from "@/components/ProtectedRoute";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { supabase } from "@/lib/supabase";

/* =========================
   TYPES
========================= */

type AuditLog = {
  id: number;

  action: string;

  entity: string;

  entity_id: string;

  performed_by: string;

  metadata: any;

  created_at: string;
};

export default function AuditLogsPage() {

  /* =========================
     STATES
  ========================= */

  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [loading, setLoading] =
    useState(true);

  /* =========================
     FETCH LOGS
  ========================= */

  const fetchLogs =
    async () => {

      const { data, error } =
        await supabase
          .from("audit_logs")
          .select("*")
          .order("id", {
            ascending: false,
          });

      if (error) {

        console.error(error);

        setLoading(false);

        return;
      }

      setLogs(data || []);

      setLoading(false);
    };

  /* =========================
     REALTIME
  ========================= */

  useEffect(() => {

    fetchLogs();

    const channel =
      supabase
        .channel(
          "audit-logs-realtime"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "audit_logs",
          },
          () => {

            fetchLogs();
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
              Audit Logs
            </h1>

            <p className="mt-2 text-gray-600">
              Enterprise activity monitoring system.
            </p>

            {/* TABLE */}

            {loading ? (

              <p className="mt-10 text-lg">
                Loading audit logs...
              </p>

            ) : (

              <div className="mt-10 overflow-x-auto rounded-xl bg-white p-6 shadow-md">

                <table className="w-full border-collapse">

                  <thead>

                    <tr className="border-b text-left">

                      <th className="p-4">
                        ID
                      </th>

                      <th className="p-4">
                        Action
                      </th>

                      <th className="p-4">
                        Entity
                      </th>

                      <th className="p-4">
                        Entity ID
                      </th>

                      <th className="p-4">
                        Performed By
                      </th>

                      <th className="p-4">
                        Metadata
                      </th>

                      <th className="p-4">
                        Timestamp
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {logs.length === 0 ? (

                      <tr>

                        <td
                          colSpan={7}
                          className="p-10 text-center text-gray-500"
                        >

                          No audit logs found

                        </td>

                      </tr>

                    ) : (

                      logs.map(
                        (log) => (

                          <tr
                            key={log.id}
                            className="border-b"
                          >

                            {/* ID */}

                            <td className="p-4">

                              {log.id}

                            </td>

                            {/* ACTION */}

                            <td className="p-4">

                              <span
                                className={`rounded px-3 py-1 text-sm font-medium ${
                                  log.action?.includes(
                                    "CREATE"
                                  )
                                    ? "bg-green-100 text-green-700"
                                    : log.action?.includes(
                                        "UPDATE"
                                      )
                                    ? "bg-blue-100 text-blue-700"
                                    : log.action?.includes(
                                        "DELETE"
                                      )
                                    ? "bg-red-100 text-red-700"
                                    : log.action?.includes(
                                        "TRANSFER"
                                      )
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >

                                {log.action}

                              </span>

                            </td>

                            {/* ENTITY */}

                            <td className="p-4 font-medium">

                              {log.entity || "N/A"}

                            </td>

                            {/* ENTITY ID */}

                            <td className="p-4">

                              {log.entity_id || "N/A"}

                            </td>

                            {/* USER */}

                            <td className="p-4">

                              {log.performed_by || "System"}

                            </td>

                            {/* METADATA */}

                            <td className="p-4">

                              <pre className="max-w-xs overflow-x-auto rounded bg-gray-100 p-2 text-xs">

                                {log.metadata
                                  ? JSON.stringify(
                                      log.metadata,
                                      null,
                                      2
                                    )
                                  : "No metadata"}

                              </pre>

                            </td>

                            {/* TIMESTAMP */}

                            <td className="p-4">

                              {new Date(
                                log.created_at
                              ).toLocaleString()}

                            </td>

                          </tr>
                        )
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