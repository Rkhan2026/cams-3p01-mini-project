"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PlacementReportGenerator from "@/components/reports/PlacementReportGenerator";
import { ArrowLeftIcon } from "@/components/ui/Icons.js";

export default function ReportsPage() {
  const [placementData, setPlacementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchPlacementData();
  }, []);

  const fetchPlacementData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tpo/placement-statistics");
      if (!response.ok) {
        throw new Error("Failed to fetch placement data");
      }
      const data = await response.json();
      setPlacementData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-neutral-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              Loading placement statistics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 bg-neutral-50 min-h-screen">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Error: {error}</div>
            <Button onClick={fetchPlacementData}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-neutral-50 min-h-screen">
      {/* Back Button at Top */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/tpo")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <ArrowLeftIcon />
          Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">
            Placement Statistics Report
          </h1>
          <p className="text-gray-300 text-lg">
            Generate comprehensive placement reports with detailed analytics and
            export options.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <PlacementReportGenerator
          data={placementData}
          onRefresh={fetchPlacementData}
        />
      </div>
    </div>
  );
}
