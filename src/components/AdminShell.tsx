"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        setLoading(false);
      })
      .catch(() => {
        router.push("/admin/login");
      });
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#6b7c8a" }}>
        Chargement...
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Tableau de bord", icon: "bi-speedometer2" },
    { href: "/admin/services", label: "Services", icon: "bi-tools" },
    { href: "/admin/projects", label: "Projets", icon: "bi-folder2-open" },
    { href: "/admin/gallery", label: "Galerie", icon: "bi-images" },
    { href: "/admin/partners", label: "Partenaires", icon: "bi-people" },
  ];

  const sysItems = [
    { href: "/admin/settings", label: "Paramètres", icon: "bi-gear" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
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
          <span className="tb-wordmark">SOTIP-<b>CI</b></span>
        </div>
        <nav className="tb-nav">
          <Link href="/admin" className={`tb-tab${isActive("/admin") ? " active" : ""}`}>
            Tableau de bord
          </Link>
          <Link href="/admin/projects" className={`tb-tab${isActive("/admin/projects") ? " active" : ""}`}>
            Projets
          </Link>
          <Link href="/admin/gallery" className={`tb-tab${isActive("/admin/gallery") ? " active" : ""}`}>
            Galerie
          </Link>
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
          <div className="sb-avatar-lg">AD</div>
          <div style={{ minWidth: 0 }}>
            <div className="sb-pname">Administrateur</div>
            <div className="sb-pstatus">
              <span className="dot"></span> En ligne
            </div>
          </div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section">Menu principal</div>
          {navItems.map((item) => (
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

          <div className="sb-section">Système</div>
          {sysItems.map((item) => (
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
          <a href="/" target="_blank" className="sb-link">
            <span className="sb-ic"><i className="bi bi-globe2"></i></span>
            Voir le site
          </a>
        </nav>

        <div style={{ margin: ".6rem 1.2rem 1.2rem", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.08)", borderRadius: ".85rem", padding: "1rem", textAlign: "center" }}>
          <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#eaf1f6" }}>Session active</div>
          <div style={{ fontSize: ".68rem", color: "#8aa2b2", margin: ".25rem 0 .7rem" }}>
            Connecté en tant qu'administrateur
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
