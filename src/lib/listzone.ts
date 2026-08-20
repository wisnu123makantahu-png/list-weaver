import { useCallback, useEffect, useState } from "react";

export type ListType = "ranking" | "tier";

export interface ListObject {
  id: string;
  name: string;
  image?: string | undefined;
  description?: string | undefined;
  score?: string | undefined;
}

export interface Tier {
  id: string;
  name: string;
  objectIds: string[];
}

export interface ListDoc {
  id: string;
  type: ListType;
  title: string;
  cover?: string | undefined;
  scoring: boolean;
  scoreOptions: string[];
  objects: ListObject[];
  pool: string[];
  ranking: string[];
  tiers: Tier[];
  createdAt: number;
}

const LISTS_KEY = "listzone:lists";
const AUTH_KEY = "listzone:auth";
const EVENT = "listzone:change";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const defaultScoreOptions = () =>
  Array.from({ length: 10 }, (_, i) => `⭐ ${10 - i}`);

export const defaultTiers = (): Tier[] =>
  ["S", "A", "B", "C"].map((name) => ({ id: uid(), name, objectIds: [] }));

function read(): ListDoc[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LISTS_KEY) ?? "[]") as ListDoc[];
  } catch {
    return [];
  }
}

function write(lists: ListDoc[]) {
  window.localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
  window.dispatchEvent(new Event(EVENT));
}

export function useLists() {
  const [lists, setLists] = useState<ListDoc[]>([]);

  useEffect(() => {
    const sync = () => setLists(read());
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const createList = useCallback((input: Omit<ListDoc, "id" | "createdAt">) => {
    const doc: ListDoc = { ...input, id: uid(), createdAt: Date.now() };
    write([doc, ...read()]);
    return doc;
  }, []);

  const updateList = useCallback((id: string, updater: (l: ListDoc) => ListDoc) => {
    write(read().map((l) => (l.id === id ? updater(l) : l)));
  }, []);

  const deleteList = useCallback((id: string) => {
    write(read().filter((l) => l.id !== id));
  }, []);

  return { lists, createList, updateList, deleteList };
}

/* auth (localStorage only, no backend for v1) */
export function getUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(AUTH_KEY);
}

export function signIn(username: string) {
  window.localStorage.setItem(AUTH_KEY, username);
  window.dispatchEvent(new Event(EVENT));
}

export function signOut() {
  window.localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(EVENT));
}

export function useUser() {
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => {
      setUser(getUser());
      setReady(true);
    };
    sync();
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { user, ready };
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function move<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const item = next.splice(from, 1)[0] as T;
  next.splice(to, 0, item);
  return next;
}