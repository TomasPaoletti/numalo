"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  url: string;
  maxHeight?: number;
}

export default function PdfViewer({ url, maxHeight = 320 }: PdfViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="bg-muted text-muted-foreground flex h-40 items-center justify-center text-sm">
        No se pudo cargar el PDF
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-full overflow-auto flex justify-center"
        style={{ maxHeight }}
      >
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={() => setError(true)}
        >
          <Page
            pageNumber={page}
            width={460}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
      {numPages > 1 && (
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="disabled:opacity-40"
          >
            ←
          </button>
          <span>
            Página {page} de {numPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
