"use client";

import { useRef, useState } from "react";
import { FileText, Trash2, UploadCloud } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

interface ComprobanteDropzoneProps {
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ComprobanteDropzone({
  file,
  onFile,
  onClear,
}: ComprobanteDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const picked = files[0];
    onFile(picked);
    if (picked.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(picked);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleClear = () => {
    onClear();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (file) {
    const isPdf = file.type === "application/pdf";

    return (
      <div className="border-border rounded-lg border p-4">
        <div className="flex items-center gap-3">
          {preview ? (
            <div className="relative size-14 shrink-0 overflow-hidden rounded-md border">
              <Image src={preview} alt="preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-md border">
              <FileText className="text-muted-foreground size-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">
              {isPdf ? "PDF" : "Imagen"} · {formatBytes(file.size)}
            </p>
          </div>
          <div className="text-[--chart-1] mr-1 shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                d="M9 12l2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="text-muted-foreground shrink-0"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      className={cn(
        "border-input flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 border-dashed px-6 py-10 transition-colors duration-150",
        dragOver
          ? "border-primary bg-primary/12"
          : "bg-muted/40 hover:border-primary/50"
      )}
    >
      <UploadCloud className="text-primary size-9" />
      <div className="text-center">
        <p className="text-sm font-medium">Arrastrá tu comprobante acá</p>
        <p className="text-muted-foreground mt-1 text-sm">
          o{" "}
          <span className="text-primary font-semibold">elegí un archivo</span>{" "}
          · JPG, PNG o PDF
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
