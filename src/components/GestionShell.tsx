"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function GestionShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/mon-espace", label: "Tableau de bord", icon: "bi-speedometer2" },
    { href: "/mon-espace/bon_caisse", label: "Bon de Caisse", icon: "bi-cash-stack" },
    { href: "/mon-espace/recu", label: "Reçu", icon: "bi-receipt" },
    { href: "/mon-espace/bon_sortie", label: "Bon de Sortie", icon: "bi-box-arrow-right" },
    { href: "/mon-espace/devis", label: "Devis", icon: "bi-file-earmark-text" },
  ];

  const isActive = (href: string) => {
    if (href === "/mon-espace") return pathname === "/mon-espace";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await fetch("/api/mon-espace/logout", { method: "POST" });
    router.push("/mon-espace/login");
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <div
        className={`sb-overlay${sidebarOpen ? " show" : ""}`}
        onClick={() => setSidebarOpen(false)}
        style={{ display: sidebarOpen ? "block" : "none" }}
      />

      <header className="topbar">
        <div className="tb-brand">
          <img src="/images/sotipci-logo.png" alt="SOTIP-CI" />
        </div>
        <nav className="tb-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`tb-tab${isActive(item.href) ? " active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="tb-right">
          <a href="/" target="_blank" className="tb-ghost">
            <i className="bi bi-box-arrow-up-right"></i> Voir le site
          </a>
          <button className="tb-burger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <i className="bi bi-list"></i>
          </button>
        </div>
      </header>

      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sb-profile">
          <div className="sb-avatar-lg">GE</div>
          <div style={{ minWidth: 0 }}>
            <div className="sb-pname">Gestionnaire</div>
            <div className="sb-pstatus">
              <span className="dot"></span> En ligne
            </div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Documents</div>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sb-link${isActive(item.href) ? " active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sb-ic"><i className={item.icon}></i></span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ margin: ".6rem 1.2rem 1.2rem", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: ".85rem", padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#eaf1f6" }}>Session active</div>
          <div style={{ fontSize: ".68rem", color: "#8aa2b2", margin: ".25rem 0 .7rem" }}>
            Connecté en tant que gestionnaire
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: "inline-flex", alignItems: "center", gap: ".35rem",
              fontSize: ".74rem", fontWeight: 700, color: "#081c26",
              background: "#a0c83c", padding: ".45rem .9rem",
              borderRadius: ".55rem", border: "none", cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <i className="bi bi-box-arrow-left"></i> Déconnexion
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: "var(--sb-w)", paddingTop: "var(--tb-h)", minHeight: "100vh" }}>
        <div className="adm-content">{children}</div>
      </main>
    </>
  );
}
