"use client";

import { useState, useRef, useCallback } from "react";

interface FileUploadProps {
  onFile: (dataUrl: string) => void;
  /** Already selected preview (data-url or path) */
  preview?: string;
  maxSizeMB?: number;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function FileUpload({ onFile, preview, maxSizeMB = 5 }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED.includes(file.type)) {
        setError("仅支持 JPG / PNG / WebP / GIF 格式");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`文件过大，请选择 ${maxSizeMB}MB 以内的图片`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onFile(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onFile, maxSizeMB],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? "var(--accent-blue)" : "var(--border-default)"}`,
          borderRadius: 12,
          padding: preview ? 0 : 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 8,
          cursor: "pointer",
          background: dragging ? "var(--accent-blue-light)" : "var(--bg-section)",
          transition: "all 200ms ease",
          overflow: "hidden",
          minHeight: preview ? 0 : 140,
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="预览"
            style={{
              width: "100%",
              maxHeight: 260,
              objectFit: "contain",
              display: "block",
            }}
          />
        ) : (
          <>
            <span style={{ fontSize: 28, opacity: 0.4 }}>📁</span>
            <p
              style={{
                fontSize: 14,
                color: "var(--text-secondary)",
                textAlign: "center",
              }}
            >
              拖拽图片到此处，或
              <span style={{ color: "var(--accent-blue)", fontWeight: 500 }}>
                {" "}
                点击选择文件
              </span>
            </p>
            <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>
              支持 JPG / PNG / WebP / GIF，最大 {maxSizeMB}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p
          style={{
            fontSize: 13,
            color: "var(--accent-red)",
            marginTop: 8,
          }}
        >
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          // Reset so re-selecting same file fires onChange
          e.target.value = "";
        }}
      />
    </div>
  );
}
