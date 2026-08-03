"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";

export default function GestionnairePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/gestionnaire")
      .then(r => r.json())
      .then(d => {
        setUsername(d.username || "gestion");
        setConfigured(d.configured);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    if (password && password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setSaving(false);
      return;
    }

    if (password && password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      setSaving(false);
      return;
    }

    const body: Record<string, string> = { username };
    if (password) body.password = password;

    const res = await fetch("/api/admin/gestionnaire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMsg("Compte gestionnaire enregistré avec succès.");
      setPassword("");
      setConfirm("");
      setConfigured(true);
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
          <h1 className="ph-title"><i className="bi bi-person-gear"></i> Compte Gestionnaire</h1>
          <p className="ph-sub">Configurer l'accès &laquo; Mon Espace &raquo; pour le gestionnaire</p>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="adm-card" style={{ maxWidth: 560 }}>
        <div className="adm-card-head">
          <h3>Identifiants du gestionnaire</h3>
        </div>
        <div className="adm-card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">Identifiant</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1rem" }}>
              <label className="form-label">
                {configured ? "Nouveau mot de passe" : "Mot de passe"} (min. 8 caractères)
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={configured ? "Laisser vide pour ne pas changer" : "Minimum 8 caractères"}
                minLength={password ? 8 : undefined}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.2rem" }}>
              <label className="form-label">Confirmer le mot de passe</label>
              <input
                type="password"
                className="form-control"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder={configured ? "Laisser vide pour ne pas changer" : "Répéter le mot de passe"}
                minLength={confirm ? 8 : undefined}
                autoComplete="new-password"
              />
            </div>

            {configured && (
              <div style={{
                padding: ".7rem 1rem",
                background: "rgba(160,200,60,.12)",
                border: "1px solid rgba(160,200,60,.3)",
                borderRadius: ".6rem",
                fontSize: ".82rem",
                color: "#5a7a1c",
                marginBottom: "1rem",
              }}>
                <i className="bi bi-check-circle-fill"></i> Compte gestionnaire actif. Le gestionnaire peut se connecter via <strong>/mon-espace/login</strong>.
              </div>
            )}

            <button type="submit" className="btn-sotip" disabled={saving}>
              <i className="bi bi-check-lg"></i> {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
