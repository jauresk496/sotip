"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetch("/api/admin/check-setup")
      .then((r) => r.json())
      .then((d) => setShowSetup(!d.configured))
      .catch(() => setShowSetup(false));
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-logo">
          <img src="/images/sotipci-logo.png" alt="SOTIP-CI" />
          <p style={{ color: "#6b7c8a", fontSize: ".85rem", marginTop: 8 }}>
            Connectez-vous pour gérer le site
          </p>
        </div>
        <div className="login-card">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Identifiant</label>
              <input type="text" name="username" required autoFocus autoComplete="username" />
            </div>
            <div className="form-group">
              <label>Mot de passe</label>
              <input type="password" name="password" required autoComplete="current-password" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-sotip"
              style={{ width: "100%" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
        <div className="login-back">
          <a href="/">&larr; Retour au site</a>
          {showSetup && (
            <>
              <span style={{ margin: "0 8px", color: "#ccc" }}>|</span>
              <a href="/admin/setup">Première connexion ?</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
