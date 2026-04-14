"use client";

import { useState } from "react";
import { useGallery, type GalleryItem } from "@/lib/store";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  Modal,
  FormField,
  inputStyle,
  selectStyle,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
} from "@/components/ui/Modal";

type ModalMode = "add" | "edit" | null;

const emptyForm = {
  title: "",
  description: "",
  tool: "",
  image: "",
  tags: "",
  selectedGroups: [] as string[],
  newGroup: "",
};

export function GalleryGrid() {
  const { items, groups, addItem, updateItem, deleteItem, addGroup } = useGallery();

  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const allGroups = ["全部", ...groups];

  const filtered =
    activeGroup === null || activeGroup === "全部"
      ? items
      : items.filter((item) => item.groups?.includes(activeGroup));

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModalMode("add");
  }

  function openEdit(item: GalleryItem) {
    setForm({
      title: item.title,
      description: item.description,
      tool: item.tool,
      image: item.image,
      tags: item.tags.join(", "),
      selectedGroups: item.groups || [],
      newGroup: "",
    });
    setEditId(item.id);
    setModalMode("edit");
  }

  function handleSave() {
    if (!form.title.trim()) return;

    // Add new group if typed
    if (form.newGroup.trim()) {
      addGroup(form.newGroup.trim());
      form.selectedGroups = [...form.selectedGroups, form.newGroup.trim()];
    }

    const payload = {
      title: form.title,
      description: form.description,
      tool: form.tool,
      date: new Date().toISOString().split("T")[0],
      image: form.image,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      groups: form.selectedGroups,
    };

    if (modalMode === "add") {
      addItem(payload);
    } else if (modalMode === "edit" && editId) {
      updateItem(editId, payload);
    }
    setModalMode(null);
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteItem(deleteTarget);
      setDeleteTarget(null);
    }
  }

  function toggleGroup(group: string) {
    setForm((p) => {
      const has = p.selectedGroups.includes(group);
      return {
        ...p,
        selectedGroups: has
          ? p.selectedGroups.filter((g) => g !== group)
          : [...p.selectedGroups, group],
      };
    });
  }

  return (
    <div>
      {/* Group tabs + Upload button row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        {/* Group pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {allGroups.map((group) => {
            const isActive =
              group === "全部"
                ? activeGroup === null || activeGroup === "全部"
                : activeGroup === group;
            return (
              <button
                key={group}
                onClick={() => setActiveGroup(group === "全部" ? null : group)}
                style={{
                  padding: "6px 16px",
                  fontSize: 13,
                  fontWeight: 500,
                  borderRadius: 20,
                  border: "none",
                  background: isActive
                    ? "var(--accent-blue)"
                    : "var(--bg-section)",
                  color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {group}
              </button>
            );
          })}
        </div>

        <button
          onClick={openAdd}
          style={{
            padding: "8px 20px",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 8,
            border: "none",
            background: "var(--accent-blue)",
            color: "#FFFFFF",
            cursor: "pointer",
            transition: "all 200ms ease",
            whiteSpace: "nowrap",
            flexShrink: 0,
            marginLeft: 16,
          }}
        >
          + 上传作品
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          暂无作品，等待灵感降临...
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {filtered.map((item) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                background: "var(--bg-card)",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "var(--shadow-1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-2)";
                e.currentTarget.style.transform = "translateY(-2px)";
                const actions = e.currentTarget.querySelector(
                  ".gallery-actions",
                ) as HTMLElement | null;
                if (actions) actions.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-1)";
                e.currentTarget.style.transform = "translateY(0)";
                const actions = e.currentTarget.querySelector(
                  ".gallery-actions",
                ) as HTMLElement | null;
                if (actions) actions.style.opacity = "0";
              }}
            >
              {/* Action buttons (hover) */}
              <div
                className="gallery-actions"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 4,
                  opacity: 0,
                  transition: "opacity 200ms ease",
                  zIndex: 2,
                }}
              >
                <SmallBtn icon="✏️" title="编辑" onClick={() => openEdit(item)} />
                <SmallBtn
                  icon="🗑"
                  title="删除"
                  onClick={() => setDeleteTarget(item.id)}
                />
              </div>

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
                  <span style={{ fontSize: 36, opacity: 0.12 }}>🎨</span>
                )}
              </div>

              {/* Info */}
              <div style={{ padding: "16px 18px" }}>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginTop: 4,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>

                {/* Tags + groups + date */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginTop: 12,
                    flexWrap: "wrap",
                  }}
                >
                  {item.tool && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: 20,
                        color: "var(--accent-blue)",
                        backgroundColor: "var(--accent-blue-light)",
                      }}
                    >
                      {item.tool}
                    </span>
                  )}
                  {item.groups?.map((g) => (
                    <span
                      key={g}
                      style={{
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "3px 10px",
                        borderRadius: 20,
                        color: "#9334E6",
                        backgroundColor: "#F3E8FD",
                      }}
                    >
                      {g}
                    </span>
                  ))}
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 20,
                        color: "var(--text-secondary)",
                        backgroundColor: "var(--bg-section)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-tertiary)",
                      marginLeft: "auto",
                    }}
                  >
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalMode !== null}
        onClose={() => setModalMode(null)}
        title={modalMode === "add" ? "上传作品" : "编辑作品"}
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Image upload */}
          <FormField label="图片">
            <FileUpload
              onFile={(dataUrl) => setForm((p) => ({ ...p, image: dataUrl }))}
              preview={form.image || undefined}
            />
          </FormField>

          <FormField label="标题">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              style={inputStyle}
              placeholder="作品标题"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-default)")
              }
            />
          </FormField>

          <FormField label="描述">
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
              placeholder="简要描述"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-default)")
              }
            />
          </FormField>

          <FormField label="工具">
            <input
              type="text"
              value={form.tool}
              onChange={(e) => setForm((p) => ({ ...p, tool: e.target.value }))}
              style={inputStyle}
              placeholder="例如 Midjourney, DALL·E 3"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-default)")
              }
            />
          </FormField>

          {/* Group selection */}
          <FormField label="分组（可多选）">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {groups.map((g) => {
                const sel = form.selectedGroups.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGroup(g)}
                    style={{
                      padding: "5px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      borderRadius: 20,
                      border: sel ? "none" : "1px solid var(--border-default)",
                      background: sel ? "var(--accent-blue)" : "transparent",
                      color: sel ? "#FFFFFF" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 200ms ease",
                    }}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={form.newGroup}
              onChange={(e) =>
                setForm((p) => ({ ...p, newGroup: e.target.value }))
              }
              style={{ ...inputStyle, marginTop: 8 }}
              placeholder="新建分组名称（可选）"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-default)")
              }
            />
          </FormField>

          <FormField label="标签（逗号分隔）">
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              style={inputStyle}
              placeholder="例如 concept-art, landscape"
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-default)")
              }
            />
          </FormField>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginTop: 24,
          }}
        >
          <SecondaryButton onClick={() => setModalMode(null)}>取消</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={!form.title.trim()}>
            {modalMode === "add" ? "上传" : "保存"}
          </PrimaryButton>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="确认删除"
        width={380}
      >
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
          确定要删除这个作品吗？此操作不可撤销。
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <SecondaryButton onClick={() => setDeleteTarget(null)}>取消</SecondaryButton>
          <DangerButton onClick={confirmDelete}>删除</DangerButton>
        </div>
      </Modal>
    </div>
  );
}

/* ── Small icon button for card overlay ── */
function SmallBtn({
  icon,
  title,
  onClick,
}: {
  icon: string;
  title: string;
  onClick: () => void;
}) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        width: 28,
        height: 28,
        borderRadius: 6,
        border: "none",
        background: "rgba(255,255,255,0.9)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        transition: "background 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.9)";
      }}
    >
      {icon}
    </button>
  );
}
