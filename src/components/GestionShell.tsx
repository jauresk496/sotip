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
      <div className={`admin-layout${sidebarOpen ? " sb-open" : ""}`}>
        <aside className={`admin-sidebar${sidebarOpen ? " show" : ""}`}>
          <div className="sb-brand">
            <img src="/images/sotipci-logo.png" alt="SOTIP-CI" />
          </div>
          <nav className="sb-nav">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`sb-link${isActive(item.href) ? " active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="sb-foot">
            <button onClick={handleLogout} className="sb-link" style={{ background: "none", border: "none", width: "100%", cursor: "pointer", color: "inherit", font: "inherit" }}>
              <i className="bi bi-box-arrow-right"></i>
              <span>Déconnexion</span>
            </button>
            <Link href="/" target="_blank" className="sb-link" style={{ textDecoration: "none" }}>
              <i className="bi bi-box-arrow-up-right"></i>
              <span>Voir le site</span>
            </Link>
          </div>
        </aside>

        <div
          className={`sb-overlay${sidebarOpen ? " show" : ""}`}
          onClick={() => setSidebarOpen(false)}
          style={{ display: sidebarOpen ? "block" : "none" }}
        />

        <header className="topbar">
          <div className="tb-brand">
            <img src="/images/sotipci-logo.png" alt="SOTIP-CI" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1rem" }}>Espace Gestion</span>
          </div>
          <button className="tb-burger" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
            <i className="bi bi-list"></i>
          </button>
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </>
  );
}
