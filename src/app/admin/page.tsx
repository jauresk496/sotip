"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ services: 0, projects: 0, partners: 0, settings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [sRes, pRes, ptRes, stRes] = await Promise.all([
          fetch("/api/admin/services"),
          fetch("/api/admin/projects"),
          fetch("/api/admin/partners"),
          fetch("/api/admin/settings"),
        ]);
        const services = await sRes.json();
        const projects = await pRes.json();
        const partners = await ptRes.json();
        const settings = await stRes.json();
        setStats({
          services: Array.isArray(services) ? services.length : 0,
          projects: Array.isArray(projects) ? projects.length : 0,
          partners: Array.isArray(partners) ? partners.length : 0,
          settings: typeof settings === "object" && !Array.isArray(settings) ? Object.keys(settings).length : 0,
        });
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: "Services", count: stats.services, icon: "bi-tools", color: "#143c50" },
    { label: "Projets", count: stats.projects, icon: "bi-folder2-open", color: "#a0c83c" },
    { label: "Partenaires", count: stats.partners, icon: "bi-people", color: "#1e5a78" },
    { label: "Paramètres", count: stats.settings, icon: "bi-gear", color: "#8ab32e" },
  ];

  return (
    <AdminShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title">Tableau de bord</h1>
          <p className="ph-sub">Vue d'ensemble du site SOTIP-CI</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", color: "#6b7c8a", padding: "2rem" }}>Chargement...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
          {cards.map((card) => (
            <div key={card.label} className="adm-card">
              <div className="adm-card-body" style={{ textAlign: "center", padding: "1.5rem" }}>
                <div style={{ fontSize: "2rem", color: card.color, marginBottom: ".5rem" }}>
                  <i className={card.icon}></i>
                </div>
                <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>
                  {card.count}
                </div>
                <div style={{ fontSize: ".85rem", color: "var(--muted)", fontWeight: 500 }}>
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
