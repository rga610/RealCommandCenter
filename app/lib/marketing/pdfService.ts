// app/lib/marketing/pdfService.ts
import puppeteer from 'puppeteer';

export async function generatePDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    const pdfData = await page.pdf({
      format: 'A3',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
      scale: 0.9,
    });
    // Wrap pdfData in a Node Buffer if it isn't already one.
    return Buffer.from(pdfData);
  } finally {
    await browser.close();
  }
}
