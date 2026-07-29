"use client";

import { useState, useEffect } from "react";

interface GalleryImage {
  id: string;
  image: string;
  caption: string;
  sort_order: number;
}

export default function ServiceGallery({ serviceSlug }: { serviceSlug: string }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/admin/service-images?service_slug=${serviceSlug}`)
      .then(res => res.json())
      .then(data => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]));
  }, [serviceSlug]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox(prev => prev !== null ? (prev + 1) % images.length : null);
      if (e.key === "ArrowLeft") setLightbox(prev => prev !== null ? (prev - 1 + images.length) % images.length : null);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="project-gallery-section">
        <h3 className="project-gallery-title">Galerie photos</h3>
        <div className="project-gallery-grid">
          {images.map((img, i) => (
            <button
              key={img.id}
              className="project-gallery-item"
              onClick={() => setLightbox(i)}
            >
              <img src={img.image} alt={img.caption || `Photo ${i + 1}`} loading="lazy" />
              {img.caption && <span className="project-gallery-caption">{img.caption}</span>}
            </button>
          ))}
        </div>
      </div>

      {lightbox !== null && images[lightbox] && (
        <div className="project-lightbox" onClick={() => setLightbox(null)}>
          <button className="project-lightbox-close" onClick={() => setLightbox(null)}>&times;</button>
          <button
            className="project-lightbox-nav project-lightbox-prev"
            onClick={e => { e.stopPropagation(); setLightbox(prev => prev !== null ? (prev - 1 + images.length) % images.length : null); }}
          >
            &lsaquo;
          </button>
          <div className="project-lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={images[lightbox].image} alt={images[lightbox].caption || ""} />
            {images[lightbox].caption && <p className="project-lightbox-caption">{images[lightbox].caption}</p>}
            <span className="project-lightbox-counter">{lightbox + 1} / {images.length}</span>
          </div>
          <button
            className="project-lightbox-nav project-lightbox-next"
            onClick={e => { e.stopPropagation(); setLightbox(prev => prev !== null ? (prev + 1) % images.length : null); }}
          >
            &rsaquo;
          </button>
        </div>
      )}
    </>
  );
}
