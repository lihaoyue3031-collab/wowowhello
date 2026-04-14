"use client";

import Link from "next/link";
import { useGallery } from "@/lib/store";

export function GalleryPreview() {
  const { items: allItems } = useGallery();
  const items = allItems.slice(-4).reverse();

  if (items.length === 0) return null;

  return (
    <div>
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h3
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: "var(--text-primary)",
            lineHeight: 1.4,
          }}
        >
          AI 作品精选
        </h3>
        <Link
          href="/gallery"
          style={{
            fontSize: 13,
            color: "var(--accent-blue)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          查看全部 →
        </Link>
      </div>

      {/* 4-col grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href="/gallery"
            style={{ textDecoration: "none", display: "block" }}
          >
            <div
              className="gallery-preview-card"
              style={{
                background: "var(--bg-card)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "var(--shadow-1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div
                style={{
                  aspectRatio: "1 / 1",
                  background: "var(--bg-section)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.image && item.image.startsWith("data:") ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 28, opacity: 0.12 }}>🎨</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "12px 14px" }}>
                <h4
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                    marginTop: 2,
                  }}
                >
                  {item.tool} · {item.date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
