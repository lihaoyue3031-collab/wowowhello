"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 480 }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(2px)",
        animation: "modalFadeIn 200ms ease",
      }}
    >
      <div
        style={{
          width,
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "var(--bg-card)",
          borderRadius: 12,
          boxShadow: "var(--shadow-3)",
          animation: "modalSlideIn 200ms ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 0 24px",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              fontSize: 18,
              transition: "background 200ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-section)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            ✕
          </button>
        </div>
        {/* Body */}
        <div style={{ padding: "20px 24px 24px 24px" }}>{children}</div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ── Shared form-level components ── */

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 12px",
  fontSize: 14,
  borderRadius: 8,
  border: "1px solid var(--border-default)",
  outline: "none",
  background: "var(--bg-card)",
  color: "var(--text-primary)",
  transition: "border-color 200ms ease",
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: "none" as const,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3' fill='none' stroke='%2386868B' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 32,
};

export function PrimaryButton({
  children,
  onClick,
  disabled,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 20px",
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        border: "none",
        background: disabled ? "#B0B0B0" : "var(--accent-blue)",
        color: "#FFFFFF",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px",
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        border: "1px solid var(--border-default)",
        background: "transparent",
        color: "var(--text-primary)",
        cursor: "pointer",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function DangerButton({
  children,
  onClick,
  style,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 20px",
        fontSize: 14,
        fontWeight: 500,
        borderRadius: 8,
        border: "none",
        background: "var(--accent-red)",
        color: "#FFFFFF",
        cursor: "pointer",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}
