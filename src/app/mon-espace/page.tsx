"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import GestionShell from "@/components/GestionShell";

interface GestionDoc {
  id: string;
  doc_type: string;
  doc_number: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

const DOC_TYPES = [
  { type: "bon_caisse", label: "Bon de Caisse", icon: "bi-cash-stack", color: "#a0c83c", desc: "Entrées et sorties de caisse" },
  { type: "recu", label: "Reçu", icon: "bi-receipt", color: "#1e5a78", desc: "Reçus de paiement clients" },
  { type: "bon_sortie", label: "Bon de Sortie", icon: "bi-box-arrow-right", color: "#143c50", desc: "Sorties de matériel / marchandises" },
];

export default function MonEspaceDashboard() {
  const [docs, setDocs] = useState<GestionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/gestion");
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const countByType = (t: string) => docs.filter(d => d.doc_type === t).length;
  const recent = docs.slice(0, 8);
  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  const typeLabel = (t: string) => DOC_TYPES.find(x => x.type === t)?.label || t;

  return (
    <GestionShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title">Espace Gestion SOTIP-CI</h1>
          <p className="ph-sub">Documents administratifs — remplacement des carnets papier</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {DOC_TYPES.map(dt => (
          <div key={dt.type} className="adm-card" style={{ borderTop: `4px solid ${dt.color}` }}>
            <div className="adm-card-body" style={{ padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".8rem" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: ".65rem",
                  background: `${dt.color}18`, color: dt.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.3rem",
                }}>
                  <i className={`bi ${dt.icon}`}></i>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--ink)", fontSize: "1rem" }}>{dt.label}</div>
                  <div style={{ fontSize: ".78rem", color: "var(--muted)" }}>{dt.desc}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)" }}>
                  {loading ? "…" : countByType(dt.type)}
                </span>
                <div style={{ display: "flex", gap: ".4rem" }}>
                  <Link href={`/mon-espace/${dt.type}`} className="btn-outline-sotip" style={{ padding: ".35rem .8rem", fontSize: ".78rem", textDecoration: "none" }}>
                    Voir
                  </Link>
                  <Link href={`/mon-espace/${dt.type}?new=1`} className="btn-sotip" style={{ padding: ".35rem .8rem", fontSize: ".78rem", textDecoration: "none" }}>
                    <i className="bi bi-plus-lg"></i> Nouveau
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="adm-card">
        <div className="adm-card-head">
          <h3><i className="bi bi-clock-history"></i> Documents récents</h3>
        </div>
        <div className="adm-card-body" style={{ padding: 0, overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>N° Document</th>
                <th>Type</th>
                <th>Référence / Bénéficiaire</th>
                <th>Date</th>
                <th style={{ width: 100 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(doc => (
                <tr key={doc.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, fontSize: ".8rem" }}>{doc.doc_number}</td>
                  <td>{typeLabel(doc.doc_type)}</td>
                  <td>{String(doc.data?.recu_de || doc.data?.nom_emetteur || "—")}</td>
                  <td>{formatDate(doc.created_at)}</td>
                  <td>
                    <Link
                      href={`/mon-espace/imprimer/${doc.id}`}
                      target="_blank"
                      className="btn-sotip"
                      style={{ padding: ".3rem .6rem", fontSize: ".75rem", textDecoration: "none" }}
                      title="Imprimer / PDF"
                    >
                      <i className="bi bi-printer"></i>
                    </Link>
                  </td>
                </tr>
              ))}
              {!loading && recent.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>Aucun document. Créez votre premier document ci-dessus.</td></tr>
              )}
              {loading && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>Chargement...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </GestionShell>
  );
}
