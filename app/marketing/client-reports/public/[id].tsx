"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ClientReport from "@/app/marketing/client-reports/ClientReport";

interface Property {
    title: string;
    socialReach: string;
    socialInteractions: string;
    emailSent: string;
    emailOpenRate: string;
    uniqueClicks: string;
    paidReach: string;
    paidImpressions: string;
    paidLeads: string;
    marketingNotes: string;
}

const PublicReportPage = ({ params }: { params: { id: string } }) => {
    const [reportData, setReportData] = useState<Property | null>(null);

    useEffect(() => {
        // Simulate fetching the report data based on the ID from the URL
        async function fetchReport() {
            try {
                const response = await fetch(`/api/get-report?id=${params.id}`);
                if (!response.ok) throw new Error("Failed to fetch report");
                const data = await response.json();
                setReportData(data);
            } catch (error) {
                console.error("Error fetching report:", error);
            }
        }

        fetchReport();
    }, [params.id]);

    if (!reportData) {
        return <div className="text-center text-red-500 mt-10 text-xl">⚠️ Error: Report not found.</div>;
    }

    return (
        <div className="max-w-5xl mx-auto bg-background shadow-xl rounded-lg p-12">
            <ClientReport property={reportData} />
        </div>
    );
};

export default PublicReportPage;
