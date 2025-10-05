import { PageData } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib';

// Set the worker script path for pdf.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * Renders all pages of given PDF files into image thumbnails.
 * @param files An array of PDF files.
 * @returns A promise that resolves to an array of PageData objects.
 */
export const renderPdfToThumbnails = async (files: File[]): Promise<PageData[]> => {
  const allPages: PageData[] = [];

  for (const file of files) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.5 }); // Lower scale for smaller thumbnails
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          allPages.push({
            id: `${file.name}-${Date.now()}-${i}`,
            originalFile: file,
            originalPageIndex: i - 1,
            thumbnailUrl: canvas.toDataURL('image/jpeg', 0.8), // Use jpeg for smaller size
          });
        }
        page.cleanup();
      }
    } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        alert(`Could not process the file "${file.name}". It might be corrupted or not a valid PDF.`);
    }
  }

  return allPages;
};

/**
 * Creates a new PDF from a list of pages.
 * @param pages An ordered array of PageData objects representing the final document structure.
 * @returns A promise that resolves to a Uint8Array of the new PDF file.
 */
export const createFinalPdf = async (pages: PageData[]): Promise<Uint8Array> => {
  const finalPdfDoc = await PDFDocument.create();
  const loadedPdfs = new Map<File, any>(); // Using 'any' for PDFDocument from pdf-lib

  for (const page of pages) {
    let sourcePdfDoc = loadedPdfs.get(page.originalFile);

    if (!sourcePdfDoc) {
      const bytes = await page.originalFile.arrayBuffer();
      sourcePdfDoc = await PDFDocument.load(bytes);
      loadedPdfs.set(page.originalFile, sourcePdfDoc);
    }

    const [copiedPage] = await finalPdfDoc.copyPages(sourcePdfDoc, [page.originalPageIndex]);
    finalPdfDoc.addPage(copiedPage);
  }

  return await finalPdfDoc.save();
};