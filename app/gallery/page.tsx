import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function GalleryPage() {
  return (
    <div style={{ maxWidth: 1080 }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          AI Gallery
        </h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", marginTop: 8 }}>
          AI辅助创作的作品集
        </p>
      </div>

      <GalleryGrid />
    </div>
  );
}
