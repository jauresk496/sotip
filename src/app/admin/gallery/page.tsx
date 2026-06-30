"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminShell from "@/components/AdminShell";
import ImageUpload from "@/components/ImageUpload";

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  sort_order: number;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [image, setImage] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur de chargement");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setImage("");
    setEditing({ title: "", image: "", sort_order: 0 });
  }

  function openEdit(item: GalleryItem) {
    setImage(item.image);
    setEditing({ ...item });
  }

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    const form = new FormData(e.currentTarget);
    const body: Partial<GalleryItem> & { image: string } = {
      id: editing?.id,
      title: (form.get("title") as string) || "",
      image,
      sort_order: parseInt(form.get("sort_order") as string) || 0,
    };

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setMsg("Image enregistrée.");
      setEditing(null);
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setMsg("Image supprimée.");
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
          <h1 className="ph-title">Galerie</h1>
          <p className="ph-sub">{items.length} image(s)</p>
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
                <h3>{editing.id ? "Modifier" : "Ajouter"} une image</h3>
                <button type="button" className="modal-close" onClick={() => setEditing(null)}>&times;</button>
              </div>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  <div>
                    <label className="form-label">Titre (optionnel)</label>
                    <input type="text" name="title" className="form-control" defaultValue={editing.title || ""} />
                  </div>
                  <div>
                    <ImageUpload name="image" value={image} onChange={setImage} label="Image" />
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

      {items.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
          {items.map((item) => (
            <div key={item.id} className="adm-card">
              <div style={{ position: "relative", overflow: "hidden", borderRadius: ".6rem .6rem 0 0" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "100%", height: 160, objectFit: "cover" }}
                />
                <div style={{ position: "absolute", top: ".4rem", right: ".4rem", display: "flex", gap: ".3rem" }}>
                  <button onClick={() => openEdit(item)} className="btn-sotip" style={{ padding: ".3rem .5rem", fontSize: ".72rem" }}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="btn-danger" style={{ padding: ".3rem .5rem", fontSize: ".72rem" }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div style={{ padding: ".6rem .8rem" }}>
                {item.title && <div style={{ fontWeight: 600, fontSize: ".85rem", color: "var(--ink)" }}>{item.title}</div>}
                <div style={{ fontSize: ".72rem", color: "var(--muted)" }}>Ordre: {item.sort_order}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adm-card">
          <div className="adm-card-body" style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>
            Aucune image dans la galerie.
          </div>
        </div>
      )}
    </AdminShell>
  );
}
