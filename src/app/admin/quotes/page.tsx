"use client";

import { useEffect, useState, useCallback } from "react";
import AdminShell from "@/components/AdminShell";

interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  project_description: string;
  budget: string | null;
  deadline: string | null;
  attachments: string[];
  status: string;
  is_read: boolean;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  reviewed: "Examiné",
  responded: "Répondu",
  archived: "Archivé",
};

const STATUS_COLORS: Record<string, string> = {
  new: "#a0c83c",
  reviewed: "#1e5a78",
  responded: "#143c50",
  archived: "#6b7c8a",
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<QuoteRequest | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/quotes");
      const data = await res.json();
      setQuotes(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const markRead = async (id: string) => {
    await fetch("/api/admin/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: true }),
    });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette demande de devis ?")) return;
    await fetch(`/api/admin/quotes?id=${id}`, { method: "DELETE" });
    if (selected?.id === id) setSelected(null);
    load();
  };

  const openDetail = (q: QuoteRequest) => {
    setSelected(q);
    if (!q.is_read) markRead(q.id);
  };

  const filtered = filter === "all" ? quotes : quotes.filter(q => q.status === filter);
  const unreadCount = quotes.filter(q => !q.is_read).length;

  const formatDate = (d: string) => {
    return new Date(d).toLocaleString("fr-FR", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <AdminShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title">Demandes de devis</h1>
          <p className="ph-sub">
            {quotes.length} demande{quotes.length > 1 ? "s" : ""} au total
            {unreadCount > 0 && <span style={{ color: "#a0c83c", fontWeight: 700 }}> · {unreadCount} non lue{unreadCount > 1 ? "s" : ""}</span>}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          {["all", "new", "reviewed", "responded", "archived"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: ".4rem .9rem",
                borderRadius: ".5rem",
                border: filter === s ? "2px solid #a0c83c" : "1px solid #e2e8f0",
                background: filter === s ? "rgba(160,200,60,0.1)" : "#fff",
                cursor: "pointer",
                fontSize: ".8rem",
                fontWeight: 600,
                color: filter === s ? "#5a7a1c" : "#6b7c8a",
                fontFamily: "inherit",
              }}
            >
              {s === "all" ? "Toutes" : STATUS_LABELS[s] || s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7c8a", padding: "2rem" }}>Chargement...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", color: "#6b7c8a", padding: "3rem" }}>
          <i className="bi bi-inbox" style={{ fontSize: "3rem", display: "block", marginBottom: "1rem" }}></i>
          Aucune demande de devis.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((q) => (
            <div
              key={q.id}
 className="adm-card"
              style={{
                borderLeft: !q.is_read ? "4px solid #a0c83c" : "4px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => openDetail(q)}
            >
              <div className="adm-card-body" style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".4rem" }}>
                      <strong style={{ fontSize: "1.05rem", color: "var(--ink)" }}>{q.name}</strong>
                      {!q.is_read && (
                        <span style={{ background: "#a0c83c", color: "#081c26", fontSize: ".65rem", fontWeight: 800, padding: ".15rem .5rem", borderRadius: "1rem" }}>NEW</span>
                      )}
                    </div>
                    <div style={{ fontSize: ".85rem", color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      <span><i className="bi bi-envelope"></i> {q.email}</span>
                      {q.phone && <span><i className="bi bi-telephone"></i> {q.phone}</span>}
                      {q.company && <span><i className="bi bi-building"></i> {q.company}</span>}
                    </div>
                    <div style={{ fontSize: ".85rem", color: "var(--text)", marginTop: ".6rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "500px" }}>
                      {q.project_description}
                    </div>
                    <div style={{ fontSize: ".75rem", color: "var(--muted)", marginTop: ".5rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                      <span><i className="bi bi-clock"></i> {formatDate(q.created_at)}</span>
                      {q.project_type && <span><i className="bi bi-tag"></i> {q.project_type}</span>}
                      {q.attachments && q.attachments.length > 0 && (
                        <span><i className="bi bi-paperclip"></i> {q.attachments.length} fichier{q.attachments.length > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: ".5rem" }}>
                    <span style={{
                      padding: ".3rem .7rem",
                      borderRadius: "1rem",
                      fontSize: ".72rem",
                      fontWeight: 700,
                      color: "#fff",
                      background: STATUS_COLORS[q.status] || "#6b7c8a",
                    }}>
                      {STATUS_LABELS[q.status] || q.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 500,
            background: "rgba(8,28,38,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
          onClick={() => setSelected(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: "1.05rem",
              width: "100%", maxWidth: "640px", maxHeight: "90vh",
              overflowY: "auto", boxShadow: "0 10px 40px rgba(8,28,38,0.25)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 1.35rem", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>Détail de la demande</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: "1.4rem", color: "var(--muted)", cursor: "pointer" }}>&times;</button>
            </div>
            <div style={{ padding: "1.35rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Nom</div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.name}</div>
                </div>
                <div>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Email</div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}><a href={`mailto:${selected.email}`} style={{ color: "var(--ink)" }}>{selected.email}</a></div>
                </div>
                {selected.phone && (
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Téléphone</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.phone}</div>
                  </div>
                )}
                {selected.company && (
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Entreprise</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.company}</div>
                  </div>
                )}
                {selected.project_type && (
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Type de projet</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.project_type}</div>
                  </div>
                )}
                {selected.budget && (
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Budget</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.budget}</div>
                  </div>
                )}
                {selected.deadline && (
                  <div>
                    <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Délai</div>
                    <div style={{ fontWeight: 600, color: "var(--ink)" }}>{selected.deadline}</div>
                  </div>
                )}
                <div>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".25rem" }}>Date</div>
                  <div style={{ fontWeight: 600, color: "var(--ink)" }}>{formatDate(selected.created_at)}</div>
                </div>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".5rem" }}>Description du projet</div>
                <div style={{ background: "#f7f9fa", borderRadius: ".65rem", padding: "1rem", fontSize: ".9rem", color: "var(--text)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {selected.project_description}
                </div>
              </div>

              {selected.attachments && selected.attachments.length > 0 && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontSize: ".72rem", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: ".5rem" }}>Pièces jointes</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                    {selected.attachments.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{
                        display: "flex", alignItems: "center", gap: ".5rem",
                        padding: ".6rem .9rem", background: "#f7f9fa",
                        borderRadius: ".5rem", fontSize: ".85rem",
                        color: "var(--ink)", textDecoration: "none",
                        border: "1px solid #e2e8f0",
                      }}>
                        <i className="bi bi-paperclip"></i> Fichier {i + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  {["new", "reviewed", "responded", "archived"].map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      style={{
                        padding: ".35rem .7rem", borderRadius: ".4rem",
                        border: selected.status === s ? "2px solid #a0c83c" : "1px solid #e2e8f0",
                        background: selected.status === s ? "rgba(160,200,60,0.1)" : "#fff",
                        cursor: "pointer", fontSize: ".75rem", fontWeight: 600,
                        color: selected.status === s ? "#5a7a1c" : "#6b7c8a",
                        fontFamily: "inherit",
                      }}
                    >
                      {STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  style={{
                    padding: ".4rem .8rem", borderRadius: ".4rem",
                    border: "none", background: "#fee2e2", color: "#a11a1a",
                    cursor: "pointer", fontSize: ".78rem", fontWeight: 700,
                    fontFamily: "inherit",
                  }}
                >
                  <i className="bi bi-trash"></i> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
