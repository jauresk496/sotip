"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";
import ImageUpload from "@/components/ImageUpload";

interface ProjectItem {
  slug: string;
  title: string;
  page_title: string;
  description: string;
  card_image: string | null;
  main_image: string | null;
  year: string | null;
  content: string[];
  sidebar_title: string | null;
  sidebar_slug: string | null;
  sort_order: number;
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<ProjectItem> | null>(null);
  const [cardImage, setCardImage] = useState("");
  const [mainImage, setMainImage] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur de chargement");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setCardImage("");
    setMainImage("");
    setEditing({ slug: "", title: "", page_title: "", description: "", card_image: "", main_image: "", year: "", content: [], sidebar_title: "", sidebar_slug: "", sort_order: 0 });
  }

  function openEdit(item: ProjectItem) {
    setCardImage(item.card_image || "");
    setMainImage(item.main_image || "");
    setEditing({ ...item });
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const form = new FormData(e.currentTarget);
    const rawContent = (form.get("content") as string) || "";
    const body: Partial<ProjectItem> & { slug: string } = {
      slug: form.get("slug") as string,
      title: form.get("title") as string,
      page_title: (form.get("page_title") as string) || "",
      description: (form.get("description") as string) || "",
      card_image: cardImage || null,
      main_image: mainImage || null,
      year: (form.get("year") as string) || "",
      content: rawContent ? rawContent.split("\n").map(l => l.trim()).filter(Boolean) : [],
      sidebar_title: (form.get("sidebar_title") as string) || "",
      sidebar_slug: (form.get("sidebar_slug") as string) || (form.get("slug") as string),
      sort_order: parseInt(form.get("sort_order") as string) || 0,
    };

    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMsg("Projet enregistré.");
      setEditing(null);
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function handleDelete(slug: string) {
    if (!confirm("Supprimer ce projet ?")) return;
    const res = await fetch(`/api/admin/projects?slug=${slug}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Projet supprimé.");
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
          <h1 className="ph-title">Projets</h1>
          <p className="ph-sub">{items.length} projet(s)</p>
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
                <h3>{editing.slug && items.find(i => i.slug === editing.slug) ? "Modifier" : "Ajouter"} un projet</h3>
                <button type="button" className="modal-close" onClick={() => setEditing(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Slug</label>
                      <input type="text" name="slug" className="form-control" required
                        defaultValue={editing.slug} readOnly={!!(editing.slug && items.find(i => i.slug === editing.slug))} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Année</label>
                      <input type="text" name="year" className="form-control" defaultValue={editing.year || ""} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Titre (carte)</label>
                      <input type="text" name="title" className="form-control" required defaultValue={editing.title} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Titre de page (H1)</label>
                      <input type="text" name="page_title" className="form-control" defaultValue={editing.page_title || ""} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows={2} defaultValue={editing.description || ""} />
                  </div>
                  <div>
                    <label className="form-label">Contenu <small style={{ color: "#6b7c8a", fontWeight: 400 }}>(un paragraphe par ligne)</small></label>
                    <textarea name="content" className="form-control" rows={5} defaultValue={(editing.content || []).join("\n")} />
                  </div>
                  <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <ImageUpload name="card_image" value={cardImage} onChange={setCardImage} label="Image de carte" />
                    </div>
                    <div style={{ flex: 1, minWidth: 250 }}>
                      <ImageUpload name="main_image" value={mainImage} onChange={setMainImage} label="Image principale" />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Titre sidebar</label>
                      <input type="text" name="sidebar_title" className="form-control" defaultValue={editing.sidebar_title || ""} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Slug sidebar</label>
                      <input type="text" name="sidebar_slug" className="form-control" defaultValue={editing.sidebar_slug || editing.slug || ""} />
                    </div>
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
                <th>Année</th>
                <th>Ordre</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.slug}>
                  <td style={{ fontFamily: "monospace", fontSize: ".78rem" }}>{item.slug}</td>
                  <td><strong>{item.title}</strong></td>
                  <td>{item.year || "-"}</td>
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
                    Aucun projet.
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
