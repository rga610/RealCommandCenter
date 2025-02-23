// app/marketing/client-reports/ClientReport.tsx
"use client";

import React, { useState } from 'react';
import ReportContent, { Property } from './ReportContent';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface ClientReportProps {
  property: Property;
}

const ClientReport = ({ property }: ClientReportProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportData: property }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ClientReport.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div>
      {/* Render the preview report (non-PDF mode) */}
      <ReportContent property={property} pdfMode={false} />
      {/* Download Report Button */}
      <div className="mt-10 flex justify-end">
        <Button
          onClick={handleDownloadPDF}
          className="bg-accent-gold hover:bg-accent-gold-light text-primary-dark p-6 rounded-md text-lg flex items-center gap-3"
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 className="animate-spin" /> : 'Download PDF'}
        </Button>
      </div>
    </div>
  );
};

export default ClientReport;
