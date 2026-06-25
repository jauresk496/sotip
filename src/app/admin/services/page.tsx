"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";

interface ServiceItem {
  slug: string;
  title: string;
  intro: string;
  content: string;
  image: string | null;
  sort_order: number;
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<ServiceItem> | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur de chargement");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing({ slug: "", title: "", intro: "", content: "", image: "", sort_order: 0 });
  }

  function openEdit(item: ServiceItem) {
    setEditing({ ...item });
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const form = new FormData(e.currentTarget);
    const body: Partial<ServiceItem> & { slug: string } = {
      slug: form.get("slug") as string,
      title: form.get("title") as string,
      intro: form.get("intro") as string,
      content: form.get("content") as string,
      image: form.get("image") as string || null,
      sort_order: parseInt(form.get("sort_order") as string) || 0,
    };

    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMsg("Service enregistré.");
      setEditing(null);
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Supprimer ce service ?")) return;
    const res = await fetch(`/api/admin/services?slug=${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Service supprimé.");
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
          <h1 className="ph-title">Services</h1>
          <p className="ph-sub">{items.length} service(s)</p>
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
                <h3>{editing.slug && items.find(i => i.slug === editing.slug) ? "Modifier" : "Ajouter"} un service</h3>
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
                    <label className="form-label">Titre</label>
                    <input type="text" name="title" className="form-control" required defaultValue={editing.title} />
                  </div>
                  <div>
                    <label className="form-label">Introduction</label>
                    <textarea name="intro" className="form-control" rows={2} defaultValue={editing.intro || ""} />
                  </div>
                  <div>
                    <label className="form-label">Contenu</label>
                    <textarea name="content" className="form-control" rows={5} defaultValue={editing.content || ""} />
                  </div>
                  <div>
                    <label className="form-label">Image (URL)</label>
                    <input type="text" name="image" className="form-control" defaultValue={editing.image || ""} />
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
                <th>Titre</th>
                <th>Ordre</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td style={{ fontFamily: "monospace", fontSize: ".78rem" }}>{item.slug}</td>
                  <td><strong>{item.title}</strong></td>
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
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>
                    Aucun service.
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
