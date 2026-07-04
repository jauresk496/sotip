"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";
import ImageUpload from "@/components/ImageUpload";

export default function AdminPagesPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"manager" | "entreprise">("manager");

  const managerImage = settings.manager_image || "";
  const entrepriseImage = settings.entreprise_image || "";

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
    const keys = [
      "manager_image", "manager_name", "manager_role", "manager_bio",
      "manager_experience", "manager_expertise", "manager_linkedin",
      "entreprise_image", "entreprise_title", "entreprise_text",
      "entreprise_statut", "entreprise_effectif",
    ];
    const updated: Record<string, string> = {};
    for (const key of keys) {
      const val = form.get(key);
      updated[key] = typeof val === "string" ? val : (settings[key] || "");
    }
    updated["manager_image"] = managerImage;
    updated["entreprise_image"] = entrepriseImage;

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setSettings(prev => ({ ...prev, ...updated }));
      setMsg("Page enregistrée avec succès.");
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <AdminShell>
        <div style={{ textAlign: "center", color: "#6b7c8a", padding: "2rem" }}>Chargement...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title">Pages Éditable</h1>
          <p className="ph-sub">Modifier le contenu des pages Manager & Entreprise</p>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
        <button
          type="button"
          className={tab === "manager" ? "btn-sotip" : "btn-outline-sotip"}
          onClick={() => setTab("manager")}
          style={{ padding: ".5rem 1.2rem", fontSize: ".85rem" }}
        >
          <i className="bi bi-person-badge"></i> Page Manager
        </button>
        <button
          type="button"
          className={tab === "entreprise" ? "btn-sotip" : "btn-outline-sotip"}
          onClick={() => setTab("entreprise")}
          style={{ padding: ".5rem 1.2rem", fontSize: ".85rem" }}
        >
          <i className="bi bi-building"></i> Page Entreprise
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {tab === "manager" && (
          <div className="adm-card">
            <div className="adm-card-head">
              <h3>Page Manager — Direction</h3>
            </div>
            <div className="adm-card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div>
                  <ImageUpload
                    name="manager_image"
                    value={managerImage}
                    onChange={(url) => setSettings(prev => ({ ...prev, manager_image: url }))}
                    label="Photo du directeur"
                  />
                </div>
                <div>
                  <label className="form-label">Nom</label>
                  <input type="text" name="manager_name" className="form-control" defaultValue={settings.manager_name || ""} />
                </div>
                <div>
                  <label className="form-label">Fonction / Rôle</label>
                  <input type="text" name="manager_role" className="form-control" defaultValue={settings.manager_role || ""} />
                </div>
                <div>
                  <label className="form-label">Biographie <small style={{ color: "#6b7c8a", fontWeight: 400 }}>(un paragraphe par ligne)</small></label>
                  <textarea name="manager_bio" className="form-control" rows={6} defaultValue={settings.manager_bio || ""} />
                </div>
                <div>
                  <label className="form-label">Expérience</label>
                  <input type="text" name="manager_experience" className="form-control" defaultValue={settings.manager_experience || ""} />
                </div>
                <div>
                  <label className="form-label">Expertise</label>
                  <input type="text" name="manager_expertise" className="form-control" defaultValue={settings.manager_expertise || ""} />
                </div>
                <div>
                  <label className="form-label">Lien LinkedIn</label>
                  <input type="text" name="manager_linkedin" className="form-control" defaultValue={settings.manager_linkedin || ""} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "entreprise" && (
          <div className="adm-card">
            <div className="adm-card-head">
              <h3>Page Entreprise — À propos</h3>
            </div>
            <div className="adm-card-body">
              <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div>
                  <ImageUpload
                    name="entreprise_image"
                    value={entrepriseImage}
                    onChange={(url) => setSettings(prev => ({ ...prev, entreprise_image: url }))}
                    label="Image de l'entreprise"
                  />
                </div>
                <div>
                  <label className="form-label">Titre (H2)</label>
                  <input type="text" name="entreprise_title" className="form-control" defaultValue={settings.entreprise_title || ""} />
                </div>
                <div>
                  <label className="form-label">Texte de présentation <small style={{ color: "#6b7c8a", fontWeight: 400 }}>(un paragraphe par ligne)</small></label>
                  <textarea name="entreprise_text" className="form-control" rows={8} defaultValue={settings.entreprise_text || ""} />
                </div>
                <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label className="form-label">Statut juridique</label>
                    <input type="text" name="entreprise_statut" className="form-control" defaultValue={settings.entreprise_statut || ""} />
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label className="form-label">Effectif</label>
                    <input type="text" name="entreprise_effectif" className="form-control" defaultValue={settings.entreprise_effectif || ""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: ".6rem", marginTop: "1rem" }}>
          <button type="submit" className="btn-sotip" disabled={saving}>
            <i className="bi bi-check-lg"></i> {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
