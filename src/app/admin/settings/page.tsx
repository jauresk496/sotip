"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(typeof data === "object" && !Array.isArray(data) ? data : {});
    } catch {
      setError("Erreur de chargement");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const form = new FormData(e.currentTarget);
    const updated: Record<string, string> = {};

    for (const key of Object.keys(settings)) {
      const val = form.get(key);
      updated[key] = typeof val === "string" ? val : settings[key];
    }

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setSettings(updated);
      setMsg("Paramètres enregistrés.");
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  const hiddenKeys = ["admin_password_hash"];

  if (loading) {
    return (
      <AdminShell>
        <div style={{ textAlign: "center", color: "#6b7c8a", padding: "2rem" }}>Chargement...</div>
      </AdminShell>
    );
  }

  const entries = Object.entries(settings).filter(([key]) => !hiddenKeys.includes(key));

  return (
    <AdminShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title">Paramètres</h1>
          <p className="ph-sub">{entries.length} paramètre(s) · Configuration du site</p>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="adm-card">
          <div className="adm-card-head">
            <h3>Tous les paramètres</h3>
          </div>
          <div className="adm-card-body">
            <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
              {entries.map(([key, value]) => (
                <div key={key}>
                  <label className="form-label">{key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</label>
                  {key === "contact_phone" || key === "contact_address" || key === "hero_subtitle" || key === "entreprise_hero_subtitle" || key === "manager_hero_subtitle" || key === "contact_hero_subtitle" || key === "site_tagline" || key === "copyright" ? (
                    <textarea name={key} className="form-control" rows={2}
                      defaultValue={value || ""} />
                  ) : key.includes("color") || key.includes("_bg") ? (
                    <input type="color" name={key} className="form-control form-control-color"
                      defaultValue={value || "#000000"} style={{ height: 40, padding: 4 }} />
                  ) : key.includes("port") || key === "smtp_port" ? (
                    <input type="number" name={key} className="form-control" defaultValue={value || "587"} />
                  ) : key === "smtp_pass" ? (
                    <input type="password" name={key} className="form-control"
                      defaultValue={value || ""} placeholder="Laisser vide pour conserver" />
                  ) : key === "smtp_secure" ? (
                    <select name={key} className="form-select" defaultValue={value || "tls"}>
                      <option value="tls">TLS</option>
                      <option value="ssl">SSL</option>
                    </select>
                  ) : (
                    <input type="text" name={key} className="form-control" defaultValue={value || ""} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
          <button type="submit" className="btn-sotip" disabled={saving}>
            <i className="bi bi-check-lg"></i> {saving ? "Enregistrement..." : "Enregistrer tous les paramètres"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
