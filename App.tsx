import React, { useState, useCallback, useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { PageData } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import PageGrid from './components/PageGrid';
import Spinner from './components/Spinner';
import { renderPdfToThumbnails, createFinalPdf } from './services/pdfUtils';

const App: React.FC = () => {
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilesChange = useCallback(async (files: File[]) => {
    setIsLoading(true);
    const newPages = await renderPdfToThumbnails(files);
    setPages(prevPages => [...prevPages, ...newPages]);
    setIsLoading(false);
  }, []);

  const handleDeletePage = useCallback((id: string) => {
    setPages(prevPages => prevPages.filter(page => page.id !== id));
  }, []);

  const handleReorderPages = useCallback((oldIndex: number, newIndex: number) => {
    setPages(prevPages => arrayMove(prevPages, oldIndex, newIndex));
  }, []);

  const handleDownload = async () => {
    if (pages.length === 0) {
      alert("There are no pages to create a PDF.");
      return;
    }
    setIsGenerating(true);
    try {
      const pdfBytes = await createFinalPdf(pages);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `combined_document_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Failed to generate PDF:", error);
        alert("An error occurred while generating the PDF. Please try again.");
    }
    setIsGenerating(false);
  };

  return (
    <div className="relative flex flex-col h-screen max-h-screen bg-slate-100">
      {(isLoading) && <Spinner message="Processing PDFs..." />}
      {(isGenerating) && <Spinner message="Generating Final PDF..." />}
      
      <Header />
      
      <main className="flex-grow flex flex-col items-center w-full overflow-hidden">
        {pages.length === 0 ? (
          <FileUpload onFilesChange={handleFilesChange} isPrimary={true} />
        ) : (
          <PageGrid pages={pages} onDelete={handleDeletePage} onReorder={handleReorderPages} />
        )}
      </main>

      {pages.length > 0 && (
        <footer className="w-full bg-white p-4 border-t border-slate-200 shadow-inner">
          <div className="container mx-auto flex justify-center items-center gap-4">
            <FileUpload onFilesChange={handleFilesChange} isPrimary={false} />
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Download PDF ({pages.length} Pages)
            </button>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
