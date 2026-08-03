"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MonEspaceSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [alreadyConfigured, setAlreadyConfigured] = useState(false);

  useEffect(() => {
    fetch("/api/mon-espace/setup")
      .then(r => r.json())
      .then(d => setAlreadyConfigured(d.configured))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/mon-espace/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password }),
    });

    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/mon-espace/login"), 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de la configuration.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card" style={{ textAlign: "center" }}>
            <h2 style={{ color: "var(--primary)", marginBottom: 16 }}>✅ Gestionnaire configuré</h2>
            <p>Redirection vers la page de connexion...</p>
          </div>
        </div>
      </div>
    );
  }

  if (alreadyConfigured) {
    return (
      <div className="login-page">
        <div className="container">
          <div className="login-card" style={{ textAlign: "center" }}>
            <p style={{ color: "#6b7c8a", marginBottom: "1rem" }}>
              Le compte gestionnaire est déjà configuré.
            </p>
            <Link href="/mon-espace/login" className="btn btn-sotip" style={{ textDecoration: "none" }}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-logo">
          <img src="/images/sotipci-logo.png" alt="SOTIP-CI" />
          <p style={{ color: "#6b7c8a", fontSize: ".85rem", marginTop: 8 }}>
            Configuration initiale du compte gestionnaire
          </p>
        </div>
        <div className="login-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Identifiant</label>
              <input type="text" name="username" required autoFocus autoComplete="username" defaultValue="gestion" />
            </div>
            <div className="form-group">
              <label>Mot de passe (min. 8 caractères)</label>
              <input type="password" name="password" required autoComplete="new-password" minLength={8} />
            </div>
            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <input type="password" name="confirm" required autoComplete="new-password" minLength={8} />
            </div>
            <button type="submit" disabled={loading} className="btn btn-sotip" style={{ width: "100%" }}>
              {loading ? "Configuration..." : "Configurer le gestionnaire"}
            </button>
          </form>
        </div>
        <div className="login-back">
          <Link href="/">&larr; Retour au site</Link>
        </div>
      </div>
    </div>
  );
}
