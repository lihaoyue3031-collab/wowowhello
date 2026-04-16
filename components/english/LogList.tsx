"use client";

import { useState, useMemo } from "react";
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

interface MonthGroup {
  key: string; // "2026-04"
  label: string; // "2026年4月"
  entries: EnglishEntry[];
}

function groupByMonth(entries: EnglishEntry[]): MonthGroup[] {
  const map = new Map<string, EnglishEntry[]>();
  for (const entry of entries) {
    const key = entry.date.slice(0, 7); // "2026-04"
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, items]) => {
      const [year, month] = key.split("-");
      return {
        key,
        label: `${year}年${parseInt(month)}月`,
        entries: items.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      };
    });
}

function getCurrentMonthKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function LogList() {
  const { logs, addLog, updateLog, deleteLog, deleteLogs } = useEnglishLog();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Batch edit state
  const [batchMode, setBatchMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);

  // Month collapse state — current month open by default
  const currentMonthKey = getCurrentMonthKey();
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  const monthGroups = useMemo(() => {
    const sorted = [...logs].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    return groupByMonth(sorted);
  }, [logs]);

  // Initialize collapsed state: history months collapsed, current expanded
  // We track which months are collapsed; current month starts NOT in the set
  function toggleMonth(key: string) {
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function isMonthCollapsed(key: string): boolean {
    // Current month defaults to expanded, history defaults to collapsed
    if (collapsedMonths.has(key)) return true;
    // If never toggled, history months default collapsed
    if (key !== currentMonthKey && !collapsedMonths.has(`_opened_${key}`)) return true;
    return false;
  }

  function toggleMonthState(key: string) {
    setCollapsedMonths((prev) => {
      const next = new Set(prev);
      const currentlyCollapsed = isMonthCollapsedFromSet(key, prev);
      if (currentlyCollapsed) {
        // Expand it
        next.delete(key);
        next.add(`_opened_${key}`);
      } else {
        // Collapse it
        next.add(key);
        next.delete(`_opened_${key}`);
      }
      return next;
    });
  }

  function isMonthCollapsedFromSet(key: string, set: Set<string>): boolean {
    if (set.has(key)) return true;
    if (key !== currentMonthKey && !set.has(`_opened_${key}`)) return true;
    return false;
  }

  function getIsCollapsed(key: string): boolean {
    return isMonthCollapsedFromSet(key, collapsedMonths);
  }

  // Batch mode helpers
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function enterBatchMode() {
    setBatchMode(true);
    setSelectedIds(new Set());
  }

  function exitBatchMode() {
    setBatchMode(false);
    setSelectedIds(new Set());
  }

  function handleBatchDelete() {
    if (selectedIds.size > 0) {
      deleteLogs(Array.from(selectedIds));
    }
    exitBatchMode();
    setBatchDeleteConfirm(false);
  }

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

  const totalEntries = logs.length;

  if (totalEntries === 0 && !modalMode) {
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
    <div style={{ paddingBottom: batchMode ? 80 : 0 }}>
      {/* Top action bar */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
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
        {!batchMode && totalEntries > 0 && (
          <button
            onClick={enterBatchMode}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: "1px solid var(--border-default)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            编辑
          </button>
        )}
      </div>

      {/* Monthly groups */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {monthGroups.map((group) => {
          const collapsed = getIsCollapsed(group.key);
          return (
            <div key={group.key}>
              {/* Month header */}
              <button
                onClick={() => toggleMonthState(group.key)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  width: "100%",
                  padding: "10px 4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-tertiary)",
                    transition: "transform 200ms ease",
                    transform: collapsed ? "rotate(0deg)" : "rotate(90deg)",
                    display: "inline-block",
                  }}
                >
                  ▶
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  {group.label}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-tertiary)",
                    fontWeight: 400,
                  }}
                >
                  · {group.entries.length}条记录
                </span>
              </button>

              {/* Entries with collapse animation */}
              <div
                style={{
                  overflow: "hidden",
                  maxHeight: collapsed ? 0 : group.entries.length * 200,
                  opacity: collapsed ? 0 : 1,
                  transition: "max-height 300ms ease, opacity 200ms ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    paddingTop: 4,
                  }}
                >
                  {group.entries.map((entry) => {
                    const entryType = entry.type || "vocabulary";
                    const typeStyle =
                      typeColors[entryType] || typeColors.vocabulary;
                    const label = typeLabels[entryType] || entryType;
                    const isSelected = selectedIds.has(entry.id);

                    return (
                      <div
                        key={entry.id}
                        className="log-entry"
                        style={{
                          position: "relative",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: batchMode ? 12 : 0,
                        }}
                      >
                        {/* Checkbox in batch mode */}
                        {batchMode && (
                          <div
                            style={{
                              paddingTop: 18,
                              flexShrink: 0,
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(entry.id)}
                              style={{
                                width: 18,
                                height: 18,
                                accentColor: "var(--accent-blue)",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                        )}

                        {/* Entry card */}
                        <div
                          style={{
                            flex: 1,
                            position: "relative",
                            background: "var(--bg-card)",
                            borderRadius: 12,
                            padding: "16px 20px",
                            boxShadow: "var(--shadow-1)",
                            transition: "all 0.2s ease",
                            border: isSelected
                              ? "2px solid var(--accent-blue)"
                              : "2px solid transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!batchMode) {
                              e.currentTarget.style.boxShadow =
                                "var(--shadow-2)";
                              e.currentTarget.style.transform =
                                "translateY(-1px)";
                              const actions = e.currentTarget.querySelector(
                                ".entry-actions",
                              ) as HTMLElement | null;
                              if (actions) actions.style.opacity = "1";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!batchMode) {
                              e.currentTarget.style.boxShadow =
                                "var(--shadow-1)";
                              e.currentTarget.style.transform =
                                "translateY(0)";
                              const actions = e.currentTarget.querySelector(
                                ".entry-actions",
                              ) as HTMLElement | null;
                              if (actions) actions.style.opacity = "0";
                            }
                          }}
                          onClick={
                            batchMode
                              ? () => toggleSelect(entry.id)
                              : undefined
                          }
                        >
                          {/* Action buttons (hover, non-batch mode) */}
                          {!batchMode && (
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
                          )}

                          {/* Top row */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginBottom: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
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
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch mode floating action bar */}
      {batchMode && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#FFFFFF",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.1)",
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            zIndex: 100,
          }}
        >
          <span
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            已选 {selectedIds.size} 条
          </span>
          <button
            onClick={() => {
              if (selectedIds.size > 0) setBatchDeleteConfirm(true);
            }}
            disabled={selectedIds.size === 0}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: "none",
              background: selectedIds.size > 0 ? "#E53935" : "#E0E0E0",
              color: selectedIds.size > 0 ? "#FFFFFF" : "#AEAEB2",
              cursor: selectedIds.size > 0 ? "pointer" : "not-allowed",
              transition: "all 200ms ease",
            }}
          >
            删除所选
          </button>
          <button
            onClick={exitBatchMode}
            style={{
              padding: "8px 20px",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              border: "1px solid var(--border-default)",
              background: "var(--bg-card)",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 200ms ease",
            }}
          >
            取消
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      <EntryModal
        open={modalMode !== null}
        mode={modalMode}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        onClose={() => setModalMode(null)}
      />

      {/* Single Delete Confirm Modal */}
      <Modal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        title="确认删除"
        width={380}
      >
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          确定要删除这条学习记录吗？此操作不可撤销。
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <SecondaryButton onClick={() => setDeleteTarget(null)}>
            取消
          </SecondaryButton>
          <DangerButton onClick={confirmDelete}>删除</DangerButton>
        </div>
      </Modal>

      {/* Batch Delete Confirm Modal */}
      <Modal
        open={batchDeleteConfirm}
        onClose={() => setBatchDeleteConfirm(false)}
        title="确认批量删除"
        width={380}
      >
        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          确定要删除选中的 {selectedIds.size} 条学习记录吗？此操作不可撤销。
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <SecondaryButton onClick={() => setBatchDeleteConfirm(false)}>
            取消
          </SecondaryButton>
          <DangerButton onClick={handleBatchDelete}>删除</DangerButton>
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
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--accent-blue)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--border-default)")
            }
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
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value }))
            }
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            placeholder="今天学了什么？"
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--accent-blue)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--border-default)")
            }
          />
        </FormField>

        <FormField label="时长">
          <input
            type="text"
            value={form.duration}
            onChange={(e) =>
              setForm((p) => ({ ...p, duration: e.target.value }))
            }
            style={inputStyle}
            placeholder="例如 30min"
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--accent-blue)")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = "var(--border-default)")
            }
          />
        </FormField>

        <FormField label="备注（可选）">
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            style={inputStyle}
            placeholder="补充说明"
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--accent-blue)")
            }
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
        <SecondaryButton onClick={onClose}>取消</SecondaryButton>
        <PrimaryButton onClick={onSave} disabled={!form.content.trim()}>
          {mode === "add" ? "添加" : "保存"}
        </PrimaryButton>
      </div>
    </Modal>
  );
}
