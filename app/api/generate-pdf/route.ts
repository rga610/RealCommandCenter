// app/api/generate-pdf/route.ts
import { NextResponse } from 'next/server';
import { generateReportHTML } from '@/lib/modules/marketing/generateReportHTML';
import { generatePDF } from '@/lib/modules/marketing/pdfService';
import type { Property } from '@/app/marketing/client-reports/ReportContent';

export async function POST(request: Request) {
  try {
    const { reportData } = await request.json();
    // Await the asynchronous HTML generator.
    const html = await generateReportHTML(reportData as Property);
    const pdfBuffer = await generatePDF(html);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="ClientReport.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
