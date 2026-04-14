"use client";

import { useState } from "react";
import { ProfileCard } from "@/components/ui/Card";
import { useProfile } from "@/lib/store";
import {
  Modal,
  FormField,
  inputStyle,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui/Modal";

type EditSection = "basic" | "work" | "interests" | "projects" | "links" | null;

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [editSection, setEditSection] = useState<EditSection>(null);

  /* ── Basic info form state ── */
  const [basicForm, setBasicForm] = useState({
    nameZh: "",
    nameEn: "",
    socialId: "",
  });

  /* ── Work form state ── */
  const [workForm, setWorkForm] = useState({ company: "", role: "" });

  /* ── Interests form state ── */
  const [interestsForm, setInterestsForm] = useState<
    { name: string; detail: string }[]
  >([]);

  /* ── Projects form state ── */
  const [projectsForm, setProjectsForm] = useState<
    { name: string; status: string; description: string }[]
  >([]);

  /* ── Links form state ── */
  const [linksForm, setLinksForm] = useState<
    { label: string; icon: string; url: string }[]
  >([]);

  function openEdit(section: EditSection) {
    if (section === "basic") {
      setBasicForm({
        nameZh: profile.name.zh,
        nameEn: profile.name.en,
        socialId: profile.socialId,
      });
    } else if (section === "work") {
      setWorkForm({ company: profile.work.company, role: profile.work.role });
    } else if (section === "interests") {
      setInterestsForm([...profile.interests]);
    } else if (section === "projects") {
      setProjectsForm([...profile.currentProjects]);
    } else if (section === "links") {
      setLinksForm([...profile.socialLinks]);
    }
    setEditSection(section);
  }

  function handleSave() {
    if (editSection === "basic") {
      updateProfile({
        name: { zh: basicForm.nameZh, en: basicForm.nameEn },
        socialId: basicForm.socialId,
      });
    } else if (editSection === "work") {
      updateProfile({ work: workForm });
    } else if (editSection === "interests") {
      updateProfile({ interests: interestsForm });
    } else if (editSection === "projects") {
      updateProfile({ currentProjects: projectsForm });
    } else if (editSection === "links") {
      updateProfile({ socialLinks: linksForm });
    }
    setEditSection(null);
  }

  const projectColors = ["var(--accent-green)", "var(--accent-blue)", "#9334E6", "var(--accent-yellow)", "var(--accent-red)"];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Avatar + Name (centered) */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--accent-blue-light)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 600,
            color: "var(--accent-blue)",
            marginBottom: 16,
          }}
        >
          {profile.name.en.charAt(0).toUpperCase()}
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {profile.name.zh} / {profile.name.en}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--text-secondary)",
            marginTop: 8,
          }}
        >
          {profile.work.company} · {profile.work.role}
        </p>
      </div>

      {/* Info cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Basic Info */}
        <EditableSection title="基本信息" onEdit={() => openEdit("basic")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InfoRow label="姓名" value={`${profile.name.zh} / ${profile.name.en}`} />
            <div style={{ height: 1, background: "var(--divider)" }} />
            <InfoRow label="社交ID" value={profile.socialId} />
          </div>
        </EditableSection>

        {/* Work */}
        <EditableSection title="工作" onEdit={() => openEdit("work")}>
          <p style={{ fontSize: 14, color: "var(--text-primary)" }}>
            {profile.work.company} · {profile.work.role}
          </p>
        </EditableSection>

        {/* Interests */}
        <EditableSection title="兴趣" onEdit={() => openEdit("interests")}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {profile.interests.map((tag) => (
              <span
                key={tag.name}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  padding: "5px 14px",
                  borderRadius: 20,
                  color: "var(--accent-blue)",
                  backgroundColor: "var(--accent-blue-light)",
                }}
              >
                {tag.name}
                {tag.detail ? ` (${tag.detail})` : ""}
              </span>
            ))}
          </div>
        </EditableSection>

        {/* Current Projects */}
        <EditableSection title="正在做的事" onEdit={() => openEdit("projects")}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {profile.currentProjects.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 12 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: projectColors[i % projectColors.length],
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 14, color: "var(--text-primary)" }}>
                  {item.name} — {item.description}
                </span>
              </div>
            ))}
          </div>
        </EditableSection>

        {/* Social links */}
        <EditableSection title="社交链接" onEdit={() => openEdit("links")}>
          <div style={{ display: "flex", gap: 12 }}>
            {profile.socialLinks.map((link) => (
              <div
                key={link.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "var(--bg-section)",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </div>
            ))}
          </div>
        </EditableSection>
      </div>

      {/* ── Modals ── */}

      {/* Basic Info Edit */}
      <Modal
        open={editSection === "basic"}
        onClose={() => setEditSection(null)}
        title="编辑基本信息"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="中文名">
            <input
              type="text"
              value={basicForm.nameZh}
              onChange={(e) =>
                setBasicForm((p) => ({ ...p, nameZh: e.target.value }))
              }
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </FormField>
          <FormField label="英文名">
            <input
              type="text"
              value={basicForm.nameEn}
              onChange={(e) =>
                setBasicForm((p) => ({ ...p, nameEn: e.target.value }))
              }
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </FormField>
          <FormField label="社交ID">
            <input
              type="text"
              value={basicForm.socialId}
              onChange={(e) =>
                setBasicForm((p) => ({ ...p, socialId: e.target.value }))
              }
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </FormField>
        </div>
        <ModalFooter onSave={handleSave} onClose={() => setEditSection(null)} />
      </Modal>

      {/* Work Edit */}
      <Modal
        open={editSection === "work"}
        onClose={() => setEditSection(null)}
        title="编辑工作信息"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="公司">
            <input
              type="text"
              value={workForm.company}
              onChange={(e) =>
                setWorkForm((p) => ({ ...p, company: e.target.value }))
              }
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </FormField>
          <FormField label="职位">
            <input
              type="text"
              value={workForm.role}
              onChange={(e) =>
                setWorkForm((p) => ({ ...p, role: e.target.value }))
              }
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
            />
          </FormField>
        </div>
        <ModalFooter onSave={handleSave} onClose={() => setEditSection(null)} />
      </Modal>

      {/* Interests Edit */}
      <Modal
        open={editSection === "interests"}
        onClose={() => setEditSection(null)}
        title="编辑兴趣"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {interestsForm.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const next = [...interestsForm];
                  next[i] = { ...next[i], name: e.target.value };
                  setInterestsForm(next);
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="兴趣名称"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <input
                type="text"
                value={item.detail}
                onChange={(e) => {
                  const next = [...interestsForm];
                  next[i] = { ...next[i], detail: e.target.value };
                  setInterestsForm(next);
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="详情"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <button
                onClick={() =>
                  setInterestsForm((f) => f.filter((_, idx) => idx !== i))
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: "var(--bg-section)",
                  cursor: "pointer",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setInterestsForm((f) => [...f, { name: "", detail: "" }])
            }
            style={{
              padding: "6px 0",
              fontSize: 13,
              color: "var(--accent-blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            + 添加兴趣
          </button>
        </div>
        <ModalFooter onSave={handleSave} onClose={() => setEditSection(null)} />
      </Modal>

      {/* Projects Edit */}
      <Modal
        open={editSection === "projects"}
        onClose={() => setEditSection(null)}
        title="编辑正在做的事"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projectsForm.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                value={item.name}
                onChange={(e) => {
                  const next = [...projectsForm];
                  next[i] = { ...next[i], name: e.target.value };
                  setProjectsForm(next);
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="项目名称"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <input
                type="text"
                value={item.description}
                onChange={(e) => {
                  const next = [...projectsForm];
                  next[i] = { ...next[i], description: e.target.value };
                  setProjectsForm(next);
                }}
                style={{ ...inputStyle, flex: 2 }}
                placeholder="描述"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <button
                onClick={() =>
                  setProjectsForm((f) => f.filter((_, idx) => idx !== i))
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: "var(--bg-section)",
                  cursor: "pointer",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setProjectsForm((f) => [
                ...f,
                { name: "", status: "active", description: "" },
              ])
            }
            style={{
              padding: "6px 0",
              fontSize: 13,
              color: "var(--accent-blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            + 添加项目
          </button>
        </div>
        <ModalFooter onSave={handleSave} onClose={() => setEditSection(null)} />
      </Modal>

      {/* Links Edit */}
      <Modal
        open={editSection === "links"}
        onClose={() => setEditSection(null)}
        title="编辑社交链接"
        width={520}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {linksForm.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="text"
                value={item.icon}
                onChange={(e) => {
                  const next = [...linksForm];
                  next[i] = { ...next[i], icon: e.target.value };
                  setLinksForm(next);
                }}
                style={{ ...inputStyle, width: 44, flex: "none", textAlign: "center" }}
                placeholder="🔗"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) => {
                  const next = [...linksForm];
                  next[i] = { ...next[i], label: e.target.value };
                  setLinksForm(next);
                }}
                style={{ ...inputStyle, flex: 1 }}
                placeholder="名称"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <input
                type="text"
                value={item.url}
                onChange={(e) => {
                  const next = [...linksForm];
                  next[i] = { ...next[i], url: e.target.value };
                  setLinksForm(next);
                }}
                style={{ ...inputStyle, flex: 2 }}
                placeholder="链接地址"
                onFocus={(e) => (e.target.style.borderColor = "var(--accent-blue)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-default)")}
              />
              <button
                onClick={() =>
                  setLinksForm((f) => f.filter((_, idx) => idx !== i))
                }
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: "none",
                  background: "var(--bg-section)",
                  cursor: "pointer",
                  fontSize: 13,
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setLinksForm((f) => [...f, { label: "", icon: "🔗", url: "" }])
            }
            style={{
              padding: "6px 0",
              fontSize: 13,
              color: "var(--accent-blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            + 添加链接
          </button>
        </div>
        <ModalFooter onSave={handleSave} onClose={() => setEditSection(null)} />
      </Modal>
    </div>
  );
}

/* ── Helper components ── */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
      }}
    >
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function EditableSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="editable-section"
      style={{ position: "relative" }}
      onMouseEnter={(e) => {
        const btn = e.currentTarget.querySelector(
          ".edit-btn",
        ) as HTMLElement | null;
        if (btn) btn.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const btn = e.currentTarget.querySelector(
          ".edit-btn",
        ) as HTMLElement | null;
        if (btn) btn.style.opacity = "0";
      }}
    >
      <ProfileCard title={title}>{children}</ProfileCard>
      <button
        className="edit-btn"
        onClick={onEdit}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
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
          opacity: 0,
          transition: "opacity 200ms ease",
        }}
        title="编辑"
      >
        ✏️
      </button>
    </div>
  );
}

function ModalFooter({
  onSave,
  onClose,
}: {
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 8,
        marginTop: 24,
      }}
    >
      <SecondaryButton onClick={onClose}>取消</SecondaryButton>
      <PrimaryButton onClick={onSave}>保存</PrimaryButton>
    </div>
  );
}
