"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useEnglishLog, type EnglishEntry } from "@/lib/store";
import {
  Modal,
  FormField,
  inputStyle,
  selectStyle,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
} from "@/components/ui/Modal";

const typeColors: Record<string, { color: string; bg: string }> = {
  listening: { color: "#1A73E8", bg: "#E8F0FE" },
  speaking: { color: "#34A853", bg: "#E6F4EA" },
  reading: { color: "#9334E6", bg: "#F3E8FD" },
  vocabulary: { color: "#E37400", bg: "#FEF3E0" },
  writing: { color: "#E8356D", bg: "#FCE4EC" },
};

const typeLabels: Record<string, string> = {
  listening: "听力",
  speaking: "口语",
  reading: "阅读",
  vocabulary: "词汇",
  writing: "写作",
};

type ModalMode = "add" | "edit" | null;

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  content: "",
  type: "vocabulary" as EnglishEntry["type"],
  duration: "30min",
  notes: "",
};

export function LogList() {
  const { logs, addLog, updateLog, deleteLog } = useEnglishLog();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const entries = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  function openAdd() {
    setForm(emptyForm);
    setEditId(null);
    setModalMode("add");
  }

  function openEdit(entry: EnglishEntry) {
    setForm({
      date: entry.date,
      content: entry.content,
      type: entry.type,
      duration: entry.duration,
      notes: entry.notes ?? "",
    });
    setEditId(entry.id);
    setModalMode("edit");
  }

  function handleSave() {
    if (!form.content.trim()) return;
    if (modalMode === "add") {
      addLog({
        date: form.date,
        content: form.content,
        type: form.type,
        duration: form.duration,
        notes: form.notes || null,
      });
    } else if (modalMode === "edit" && editId) {
      updateLog(editId, {
        date: form.date,
        content: form.content,
        type: form.type,
        duration: form.duration,
        notes: form.notes || null,
      });
    }
    setModalMode(null);
  }

  function confirmDelete() {
    if (deleteTarget) {
      deleteLog(deleteTarget);
      setDeleteTarget(null);
    }
  }

  if (entries.length === 0 && !modalMode) {
    return (
      <div>
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
            marginBottom: 16,
          }}
        >
          + 添加记录
        </button>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          还没有学习记录，开始你的第一天吧！
        </p>
        <EntryModal
          open={modalMode !== null}
          mode={modalMode}
          form={form}
          setForm={setForm}
          onSave={handleSave}
          onClose={() => setModalMode(null)}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Add button */}
      <div style={{ marginBottom: 16 }}>
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
          }}
        >
          + 添加记录
        </button>
      </div>

      {/* Entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map((entry) => {
          const entryType = entry.type || "vocabulary";
          const typeStyle = typeColors[entryType] || typeColors.vocabulary;
          const label = typeLabels[entryType] || entryType;

          return (
            <div
              key={entry.id}
              className="log-entry"
              style={{
                position: "relative",
                background: "var(--bg-card)",
                borderRadius: 12,
                padding: "16px 20px",
                boxShadow: "var(--shadow-1)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-2)";
                e.currentTarget.style.transform = "translateY(-1px)";
                const actions = e.currentTarget.querySelector(
                  ".entry-actions",
                ) as HTMLElement | null;
                if (actions) actions.style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "var(--shadow-1)";
                e.currentTarget.style.transform = "translateY(0)";
                const actions = e.currentTarget.querySelector(
                  ".entry-actions",
                ) as HTMLElement | null;
                if (actions) actions.style.opacity = "0";
              }}
            >
              {/* Action buttons (hover) */}
              <div
                className="entry-actions"
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  display: "flex",
                  gap: 4,
                  opacity: 0,
                  transition: "opacity 200ms ease",
                }}
              >
                <IconButton
                  icon="✏️"
                  title="编辑"
                  onClick={() => openEdit(entry)}
                />
                <IconButton
                  icon="🗑"
                  title="删除"
                  onClick={() => setDeleteTarget(entry.id)}
                />
              </div>

              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {formatDate(entry.date)}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: "3px 10px",
                      borderRadius: 20,
                      color: typeStyle.color,
                      backgroundColor: typeStyle.bg,
                    }}
                  >
                    {label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                  }}
                >
                  {entry.duration}
                </span>
              </div>

              {/* Content */}
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {entry.content}
              </p>

              {/* Notes */}
              {entry.notes && (
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-tertiary)",
                    marginTop: 6,
                    fontStyle: "italic",
                  }}
                >
                  {entry.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      <EntryModal
        open={modalMode !== null}
        mode={modalMode}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        onClose={() => setModalMode(null)}
      />

      {/* Delete Confirm Modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="确认删除"
        width={380}
      >
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
          确定要删除这条学习记录吗？此操作不可撤销。
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <SecondaryButton onClick={() => setDeleteTarget(null)}>取消</SecondaryButton>
          <DangerButton onClick={confirmDelete}>删除</DangerButton>
        </div>
      </Modal>
    </div>
  );
}

/* ── Shared icon button ── */
function IconButton({
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
        background: "var(--bg-section)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        transition: "background 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--border-default)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-section)";
      }}
    >
      {icon}
    </button>
  );
}

/* ── Entry form modal ── */
function EntryModal({
  open,
  mode,
  form,
  setForm,
  onSave,
  onClose,
}: {
  open: boolean;
  mode: ModalMode;
  form: typeof emptyForm;
  setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "add" ? "添加学习记录" : "编辑学习记录"}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField label="日期">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
          />
        </FormField>

        <FormField label="类型">
          <select
            value={form.type}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                type: e.target.value as EnglishEntry["type"],
              }))
            }
            style={selectStyle}
          >
            <option value="listening">听力</option>
            <option value="speaking">口语</option>
            <option value="reading">阅读</option>
            <option value="vocabulary">词汇</option>
            <option value="writing">写作</option>
          </select>
        </FormField>

        <FormField label="内容描述">
          <textarea
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="今天学了什么？"
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
          />
        </FormField>

        <FormField label="时长">
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
            style={inputStyle}
            placeholder="例如 30min"
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
          />
        </FormField>

        <FormField label="备注（可选）">
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            style={inputStyle}
            placeholder="补充说明"
            onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
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
        <SecondaryButton onClick={onClose}>取消</SecondaryButton>
        <PrimaryButton onClick={onSave} disabled={!form.content.trim()}>
          {mode === "add" ? "添加" : "保存"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
