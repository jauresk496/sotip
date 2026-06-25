"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";

interface PartnerItem {
  slug: string;
  image: string;
  name: string;
  sort_order: number;
}

export default function AdminPartnersPage() {
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<PartnerItem> | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur de chargement");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing({ slug: "", image: "", name: "", sort_order: 0 });
  }

  function openEdit(item: PartnerItem) {
    setEditing({ ...item });
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const form = new FormData(e.currentTarget);
    const body: Partial<PartnerItem> & { slug: string } = {
      slug: form.get("slug") as string,
      name: form.get("name") as string,
      image: (form.get("image") as string) || "",
      sort_order: parseInt(form.get("sort_order") as string) || 0,
    };

    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMsg("Partenaire enregistré.");
      setEditing(null);
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Supprimer ce partenaire ?")) return;
    const res = await fetch(`/api/admin/partners?slug=${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Partenaire supprimé.");
      load();
    }
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
          <h1 className="ph-title">Partenaires</h1>
          <p className="ph-sub">{items.length} partenaire(s)</p>
        </div>
        <div className="ph-actions">
          <button onClick={openCreate} className="ph-pill solid">
            <i className="bi bi-plus-lg"></i> Ajouter
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {editing !== null && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="modal-head">
                <h3>{editing.slug && items.find(i => i.slug === editing.slug) ? "Modifier" : "Ajouter"} un partenaire</h3>
                <button type="button" className="modal-close" onClick={() => setEditing(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  <div>
                    <label className="form-label">Slug</label>
                    <input type="text" name="slug" className="form-control" required
                      defaultValue={editing.slug} readOnly={!!(editing.slug && items.find(i => i.slug === editing.slug))} />
                  </div>
                  <div>
                    <label className="form-label">Nom</label>
                    <input type="text" name="name" className="form-control" required defaultValue={editing.name} />
                  </div>
                  <div>
                    <label className="form-label">Logo (URL)</label>
                    <input type="text" name="image" className="form-control" defaultValue={editing.image || ""} />
                    {editing.image && (
                      <div style={{ marginTop: ".4rem" }}>
                        <img src={editing.image} alt="" width={60} height={40} style={{ objectFit: "contain", border: "1px solid var(--line)", borderRadius: ".4rem" }} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="form-label">Ordre d'affichage</label>
                    <input type="number" name="sort_order" className="form-control" defaultValue={editing.sort_order ?? 0} />
                  </div>
                </div>
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-outline-sotip" onClick={() => setEditing(null)}>Annuler</button>
                <button type="submit" className="btn-sotip" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="adm-card">
        <div className="adm-card-body" style={{ padding: 0, overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Nom</th>
                <th>Logo</th>
                <th>Ordre</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td style={{ fontFamily: "monospace", fontSize: ".78rem" }}>{item.slug}</td>
                  <td><strong>{item.name}</strong></td>
                  <td>
                    {item.image ? (
                      <img src={item.image} alt={item.name} width={48} height={32} style={{ objectFit: "contain", borderRadius: ".3rem" }} />
                    ) : (
                      <span style={{ color: "#6b7c8a", fontSize: ".75rem" }}>-</span>
                    )}
                  </td>
                  <td>{item.sort_order}</td>
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <button onClick={() => openEdit(item)} className="btn-sotip" style={{ padding: ".3rem .6rem", fontSize: ".75rem" }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(item.slug)} className="btn-danger" style={{ padding: ".3rem .6rem", fontSize: ".75rem" }}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>
                    Aucun partenaire.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
