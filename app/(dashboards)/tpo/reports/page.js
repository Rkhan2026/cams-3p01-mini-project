"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import PlacementReportGenerator from "@/components/reports/PlacementReportGenerator";
import PageHeader from "@/components/layout/PageHeader";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";

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
        <LoadingState 
          message="Loading placement statistics..." 
          size="md" 
          fullScreen={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 bg-neutral-50 min-h-screen">
        <ErrorState 
          message={error} 
          onRetry={fetchPlacementData} 
          fullScreen={true}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-neutral-50 min-h-screen">
      <PageHeader 
        title="Placement Statistics Report"
        subtitle="Generate comprehensive placement reports with detailed analytics and export options."
        backHref="/tpo"
        gradient={true}
      />

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
