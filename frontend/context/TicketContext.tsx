"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

// ─── Types ───────────────────────────────────────────────
export type Category =
  | "All"
  | "Bug Report"
  | "Feature Request"
  | "Billing Issue"
  | "General Question"
  | "Urgent/Critical";

export type Status = "open" | "resolved";

export interface Ticket {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: Exclude<Category, "All"> | null;
  priority: 1 | 2 | 3 | 4 | 5 | null;
  aiSummary: string | null;
  aiStatus: "pending" | "processed" | "failed";
  status: Status;
  createdAt: string;
}

interface TicketContextValue {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (v: string) => void;
  categoryFilter: Category;
  setCategoryFilter: (v: Category) => void;
  sortBy: "priority" | "createdAt";
  setSortBy: (v: "priority" | "createdAt") => void;
  filtered: Ticket[];
  stats: { total: number; open: number; resolved: number; urgent: number };
  markResolved: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const TicketContext = createContext<TicketContextValue | null>(null);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<"priority" | "createdAt">("createdAt");

  const API = process.env.NEXT_PUBLIC_API_URL;

  // No Authorization header needed — browser cookie auto-send karega
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/feedback`);
      setTickets(res.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message ?? "Failed to fetch tickets");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [API]);

  const markResolved = useCallback(
    async (id: string) => {
      setTickets((prev) =>
        prev.map((t) => (t._id === id ? { ...t, status: "resolved" } : t))
      );
      try {
        await axios.patch(`${API}/feedback/${id}/resolve`);
      } catch {
        setTickets((prev) =>
          prev.map((t) => (t._id === id ? { ...t, status: "open" } : t))
        );
      }
    },
    [API]
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filtered = tickets
    .filter((t) => {
      const matchCategory =
        categoryFilter === "All" || t.category === categoryFilter;
      const q = search.toLowerCase();
      return (
        matchCategory &&
        (t.name.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q))
      );
    })
    .sort((a, b) =>
      sortBy === "priority"
        ? (b.priority ?? 0) - (a.priority ?? 0)
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter(
      (t) => t.category === "Urgent/Critical" && t.status === "open"
    ).length,
  };

  return (
    <TicketContext.Provider
      value={{
        tickets, loading, error,
        search, setSearch,
        categoryFilter, setCategoryFilter,
        sortBy, setSortBy,
        filtered, stats,
        markResolved, refetch: fetchTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTickets() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used inside <TicketProvider>");
  return ctx;
}