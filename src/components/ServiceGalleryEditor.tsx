"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ImageUpload";

interface ServiceImage {
  id: string;
  service_slug: string;
  image: string;
  caption: string;
  sort_order: number;
}

export default function ServiceGalleryEditor({ serviceSlug }: { serviceSlug: string }) {
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch(`/api/admin/service-images?service_slug=${serviceSlug}`);
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setError("Erreur de chargement de la galerie");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [serviceSlug]);

  async function handleAdd() {
    if (!newImageUrl) {
      setError("Veuillez ajouter une image");
      return;
    }
    setSaving(true);
    setError("");
    const maxOrder = images.length > 0 ? Math.max(...images.map(i => i.sort_order)) : 0;
    const res = await fetch("/api/admin/service-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_slug: serviceSlug,
        image: newImageUrl,
        caption: newCaption,
        sort_order: maxOrder + 1,
      }),
    });
    if (res.ok) {
      setNewImageUrl("");
      setNewCaption("");
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/admin/service-images?id=${id}`, { method: "DELETE" });
    load();
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex(i => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const item = sorted[idx];
    const swapItem = sorted[swapIdx];

    await Promise.all([
      fetch("/api/admin/service-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, service_slug: serviceSlug, image: item.image, caption: item.caption, sort_order: swapItem.sort_order }),
      }),
      fetch("/api/admin/service-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: swapItem.id, service_slug: serviceSlug, image: swapItem.image, caption: swapItem.caption, sort_order: item.sort_order }),
      }),
    ]);
    load();
  }

  if (loading) return <div style={{ color: "#6b7c8a", padding: "1rem" }}>Chargement de la galerie...</div>;

  return (
    <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "1rem", marginTop: "1rem" }}>
      <h4 style={{ fontSize: ".9rem", fontWeight: 700, color: "var(--ink)", marginBottom: ".8rem" }}>
        <i className="bi bi-images"></i> Galerie d'images de l'activité
      </h4>

      {error && <div className="alert alert-danger" style={{ fontSize: ".8rem" }}>{error}</div>}

      <div style={{ marginBottom: "1rem", padding: "1rem", background: "#f7f9fa", borderRadius: ".65rem", border: "1px solid #e2e8f0" }}>
        <ImageUpload
          name="new_gallery_image"
          value={newImageUrl}
          onChange={setNewImageUrl}
          label="Ajouter une image à la galerie"
        />
        <div style={{ marginTop: ".5rem" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Légende (optionnel)"
            value={newCaption}
            onChange={e => setNewCaption(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn-sotip"
          onClick={handleAdd}
          disabled={saving || !newImageUrl}
          style={{ marginTop: ".5rem", padding: ".4rem .9rem", fontSize: ".8rem" }}
        >
          {saving ? "Ajout..." : <><i className="bi bi-plus-lg"></i> Ajouter à la galerie</>}
        </button>
      </div>

      {images.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: ".8rem" }}>
          {images.sort((a, b) => a.sort_order - b.sort_order).map((img, i) => (
            <div key={img.id} style={{ position: "relative", borderRadius: ".5rem", overflow: "hidden", border: "1px solid #e2e8f0" }}>
              <img
                src={img.image}
                alt={img.caption || ""}
                style={{ width: "100%", height: 100, objectFit: "cover", display: "block" }}
              />
              {img.caption && (
                <div style={{ padding: ".3rem .4rem", fontSize: ".7rem", color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {img.caption}
                </div>
              )}
              <div style={{ position: "absolute", top: 4, right: 4, display: "flex", gap: ".2rem" }}>
                <button
                  type="button"
                  onClick={() => handleReorder(img.id, "up")}
                  disabled={i === 0}
                  style={{ background: "rgba(255,255,255,.9)", border: "none", borderRadius: ".3rem", cursor: i === 0 ? "default" : "pointer", padding: ".15rem .3rem", fontSize: ".7rem", opacity: i === 0 ? .4 : 1 }}
                >
                  <i className="bi bi-arrow-up"></i>
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(img.id, "down")}
                  disabled={i === images.length - 1}
                  style={{ background: "rgba(255,255,255,.9)", border: "none", borderRadius: ".3rem", cursor: i === images.length - 1 ? "default" : "pointer", padding: ".15rem .3rem", fontSize: ".7rem", opacity: i === images.length - 1 ? .4 : 1 }}
                >
                  <i className="bi bi-arrow-down"></i>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  style={{ background: "rgba(220,53,69,.9)", color: "#fff", border: "none", borderRadius: ".3rem", cursor: "pointer", padding: ".15rem .3rem", fontSize: ".7rem" }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "#6b7c8a", fontSize: ".85rem", textAlign: "center", padding: "1rem" }}>
          Aucune image dans la galerie. Ajoutez-en ci-dessus.
        </div>
      )}
    </div>
  );
}
