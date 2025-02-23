// lib/marketing/generateReportHTML.ts

// Tell Next.js that this module is to run only on the Node.js runtime.
export const runtime = 'nodejs';

import React from 'react';
import type { Property } from '../../app/marketing/client-reports/ReportContent';

const getBaseUrl = (): string =>
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Generates the full HTML document for the report.
 * We load react-dom/server dynamically (using require) so that Next.js doesn’t statically analyze this dependency.
 */
export const generateReportHTML = async (reportData: Property): Promise<string> => {
  const ReactDOMServer = require('react-dom/server');

  // Use a relative path import for ReportContent.
  const { default: ReportContent } = await import('../../app/marketing/client-reports/ReportContent');
  
  // Render the ReportContent component to static markup in pdfMode.
  const content = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ReportContent, { property: reportData, pdfMode: true })
  );

  // Build the full HTML document.
  const baseUrl = getBaseUrl();
  return `
    <html>
      <head>
        <link rel="stylesheet" href="${baseUrl}/css/print.css">
      </head>
      <body class="bg-background text-primary-dark">
        ${content}
      </body>
    </html>
  `;
};
