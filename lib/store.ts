"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

/* ─────────────────────────────────────────────
   Type definitions
   ───────────────────────────────────────────── */

export interface EnglishEntry {
  id: string;
  date: string;
  content: string;
  duration: string;
  type: "listening" | "speaking" | "reading" | "vocabulary" | "writing";
  notes: string | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  tool: string;
  date: string;
  image: string; // base64 data-url or path
  tags: string[];
  groups: string[];
}

export interface ProfileData {
  name: { zh: string; en: string };
  socialId: string;
  work: { company: string; role: string };
  interests: { name: string; detail: string }[];
  currentProjects: { name: string; status: string; description: string }[];
  socialLinks: { label: string; icon: string; url: string }[];
}

/* ─────────────────────────────────────────────
   Default data imports (JSON fallbacks)
   ───────────────────────────────────────────── */

import defaultEnglishLog from "@/data/english-log.json";
import defaultGallery from "@/data/gallery.json";
import defaultProfile from "@/data/profile.json";

/* ─────────────────────────────────────────────
   localStorage helpers
   ───────────────────────────────────────────── */

const KEYS = {
  english: "lee-space:english-log",
  gallery: "lee-space:gallery",
  galleryGroups: "lee-space:gallery-groups",
  profile: "lee-space:profile",
} as const;

function readLS<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeLS<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/* ─────────────────────────────────────────────
   Simple external store pattern for cross-
   component reactivity via useSyncExternalStore
   ───────────────────────────────────────────── */

type Listener = () => void;

function createStore<T>(key: string, getDefault: () => T) {
  let listeners: Listener[] = [];
  let cache: T | undefined;

  function get(): T {
    if (cache !== undefined) return cache;
    const stored = readLS<T>(key);
    cache = stored ?? getDefault();
    return cache;
  }

  function set(data: T) {
    cache = data;
    writeLS(key, data);
    listeners.forEach((l) => l());
  }

  function subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }

  return { get, set, subscribe };
}

/* ─────────────────────────────────────────────
   Store instances
   ───────────────────────────────────────────── */

const DEFAULT_GROUPS = ["AI绘画", "其他"];

function getDefaultEntries(): EnglishEntry[] {
  return defaultEnglishLog.entries.map((e, i) => ({
    id: `default-${i}`,
    date: e.date,
    content: e.content,
    duration: e.duration,
    type: (e as { type?: string }).type as EnglishEntry["type"] || "vocabulary",
    notes: e.notes ?? null,
  }));
}

function getDefaultGalleryItems(): GalleryItem[] {
  return defaultGallery.items.map((item) => ({
    ...item,
    groups: ["AI绘画"],
  }));
}

function getDefaultProfile(): ProfileData {
  const p = defaultProfile;
  return {
    name: p.name,
    socialId: p.socialId,
    work: p.work,
    interests: p.interests,
    currentProjects: p.currentProjects,
    socialLinks: [
      { label: "GitHub", icon: "🔗", url: "" },
      { label: "Twitter", icon: "🐦", url: "" },
      { label: "微信", icon: "💬", url: "" },
    ],
  };
}

const englishStore = createStore<EnglishEntry[]>(KEYS.english, getDefaultEntries);
const galleryStore = createStore<GalleryItem[]>(KEYS.gallery, getDefaultGalleryItems);
const groupsStore = createStore<string[]>(KEYS.galleryGroups, () => DEFAULT_GROUPS);
const profileStore = createStore<ProfileData>(KEYS.profile, getDefaultProfile);

/* ─────────────────────────────────────────────
   React hooks
   ───────────────────────────────────────────── */

/** English learning log hook */
export function useEnglishLog() {
  const logs = useSyncExternalStore(
    englishStore.subscribe,
    englishStore.get,
    getDefaultEntries,
  );

  const addLog = useCallback((entry: Omit<EnglishEntry, "id">) => {
    const current = englishStore.get();
    englishStore.set([...current, { ...entry, id: generateId() }]);
  }, []);

  const updateLog = useCallback((id: string, patch: Partial<EnglishEntry>) => {
    const current = englishStore.get();
    englishStore.set(current.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }, []);

  const deleteLog = useCallback((id: string) => {
    const current = englishStore.get();
    englishStore.set(current.filter((e) => e.id !== id));
  }, []);

  return { logs, addLog, updateLog, deleteLog };
}

/** Gallery hook */
export function useGallery() {
  const items = useSyncExternalStore(
    galleryStore.subscribe,
    galleryStore.get,
    getDefaultGalleryItems,
  );

  const groups = useSyncExternalStore(
    groupsStore.subscribe,
    groupsStore.get,
    () => DEFAULT_GROUPS,
  );

  const addItem = useCallback((item: Omit<GalleryItem, "id">) => {
    const current = galleryStore.get();
    galleryStore.set([...current, { ...item, id: generateId() }]);
  }, []);

  const updateItem = useCallback((id: string, patch: Partial<GalleryItem>) => {
    const current = galleryStore.get();
    galleryStore.set(current.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);

  const deleteItem = useCallback((id: string) => {
    const current = galleryStore.get();
    galleryStore.set(current.filter((g) => g.id !== id));
  }, []);

  const addGroup = useCallback((name: string) => {
    const current = groupsStore.get();
    if (!current.includes(name)) {
      groupsStore.set([...current, name]);
    }
  }, []);

  const deleteGroup = useCallback((name: string) => {
    const current = groupsStore.get();
    groupsStore.set(current.filter((g) => g !== name));
  }, []);

  return { items, groups, addItem, updateItem, deleteItem, addGroup, deleteGroup };
}

/** Profile hook */
export function useProfile() {
  const profile = useSyncExternalStore(
    profileStore.subscribe,
    profileStore.get,
    getDefaultProfile,
  );

  const updateProfile = useCallback((patch: Partial<ProfileData>) => {
    const current = profileStore.get();
    profileStore.set({ ...current, ...patch });
  }, []);

  return { profile, updateProfile };
}
