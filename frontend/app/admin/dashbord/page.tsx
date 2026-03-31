"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bot,
  LogOut,
  Search,
  Tickets,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { TicketProvider, useTickets, type Category } from "@/context/TicketContext";

// ─── Helpers ─────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Bug Report": "bg-red-100 text-red-700 border-red-200",
  "Feature Request": "bg-blue-100 text-blue-700 border-blue-200",
  "Billing Issue": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "General Question": "bg-gray-100 text-gray-700 border-gray-200",
  "Urgent/Critical": "bg-orange-100 text-orange-700 border-orange-200",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-lime-100 text-lime-700",
  3: "bg-yellow-100 text-yellow-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-red-100 text-red-700",
};

const PRIORITY_LABEL: Record<number, string> = {
  1: "P1 Low", 2: "P2", 3: "P3 Mid", 4: "P4", 5: "P5 Critical",
};

const timeAgo = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
};

// ─── Inner Dashboard (context consumer) ──────────────────
function DashboardContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const {
    loading,
    search, setSearch,
    categoryFilter, setCategoryFilter,
    sortBy, setSortBy,
    filtered, stats,
    markResolved,
  } = useTickets();

  // Auth guard — cookie valid nahi → login pe bhejo
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-sm text-gray-400">Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#c8f135] rounded-lg flex items-center justify-center">
              <Bot className="w-4 h-4 text-gray-900" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base">FeedbackPilot</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-1">Admin</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-xs gap-1.5 rounded-full"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Total Tickets", value: stats.total, icon: Tickets, color: "text-blue-600 bg-blue-50" },
            { label: "Open", value: stats.open, icon: Clock, color: "text-yellow-600 bg-yellow-50" },
            { label: "Resolved", value: stats.resolved, icon: CheckCircle2, color: "text-green-600 bg-green-50" },
            { label: "Urgent", value: stats.urgent, icon: AlertCircle, color: "text-red-600 bg-red-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-xl border-gray-200 bg-gray-50 h-10 text-sm"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as Category)}>
              <SelectTrigger className="w-full sm:w-48 rounded-xl border-gray-200 bg-gray-50 h-10 text-sm">
                <Filter className="w-3.5 h-3.5 mr-1 text-gray-400" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {["All", "Bug Report", "Feature Request", "Billing Issue", "General Question", "Urgent/Critical"].map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "priority" | "createdAt")}>
              <SelectTrigger className="w-full sm:w-40 rounded-xl border-gray-200 bg-gray-50 h-10 text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Latest First</SelectItem>
                <SelectItem value="priority">Highest Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* TICKETS TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">
              Tickets <span className="text-gray-400 font-normal">({filtered.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center text-gray-400 py-10 text-sm">Loading tickets...</div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs">Customer</TableHead>
                      <TableHead className="text-xs">Subject</TableHead>
                      <TableHead className="text-xs">Category</TableHead>
                      <TableHead className="text-xs">Priority</TableHead>
                      <TableHead className="text-xs">AI Summary</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                      <TableHead className="text-xs">Time</TableHead>
                      <TableHead className="text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-gray-400 py-10 text-sm">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((t) => (
                        <TableRow key={t._id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                            <p className="text-xs text-gray-400">{t.email}</p>
                          </TableCell>
                          <TableCell className="text-sm text-gray-700 max-w-[140px] truncate">{t.subject}</TableCell>
                          <TableCell>
                            {t.category ? (
                              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${CATEGORY_COLORS[t.category]}`}>
                                {t.category}
                              </span>
                            ) : <span className="text-xs text-gray-300">Pending</span>}
                          </TableCell>
                          <TableCell>
                            {t.priority ? (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[t.priority]}`}>
                                {PRIORITY_LABEL[t.priority]}
                              </span>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </TableCell>
                          <TableCell className="text-xs text-gray-500 max-w-[160px]">
                            {t.aiSummary ?? <span className="text-gray-300">—</span>}
                          </TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              t.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                            }`}>{t.status}</span>
                          </TableCell>
                          <TableCell className="text-xs text-gray-400">{timeAgo(t.createdAt)}</TableCell>
                          <TableCell>
                            {t.status === "open" ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markResolved(t._id)}
                                className="text-xs rounded-full h-7 px-3 border-green-200 text-green-700 hover:bg-green-50"
                              >
                                Resolve
                              </Button>
                            ) : <span className="text-xs text-gray-300">Done</span>}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <p className="text-center text-gray-400 py-10 text-sm">No tickets found</p>
                ) : (
                  filtered.map((t) => (
                    <div key={t._id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{t.name}</p>
                          <p className="text-xs text-gray-400">{t.email}</p>
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{timeAgo(t.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{t.subject}</p>
                      <p className="text-xs text-gray-500">{t.aiSummary ?? "AI processing pending"}</p>
                      <div className="flex flex-wrap gap-2">
                        {t.category && (
                          <span className={`text-xs px-2 py-1 rounded-full border font-medium ${CATEGORY_COLORS[t.category]}`}>
                            {t.category}
                          </span>
                        )}
                        {t.priority && (
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[t.priority]}`}>
                            {PRIORITY_LABEL[t.priority]}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          t.status === "resolved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}>{t.status}</span>
                      </div>
                      {t.status === "open" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markResolved(t._id)}
                          className="text-xs rounded-full h-7 px-3 border-green-200 text-green-700 hover:bg-green-50 w-full"
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── Page Export ──────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <TicketProvider>
      <DashboardContent />
    </TicketProvider>
  );
}