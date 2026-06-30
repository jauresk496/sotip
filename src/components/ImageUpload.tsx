"use client";

import { useRef, useState } from "react";

interface ImageUploadProps {
  name: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ name, value, onChange, label }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'upload");
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Erreur réseau lors de l'upload");
    }

    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {label && <label className="form-label">{label}</label>}
      <input type="hidden" name={name} value={value} />
      <div style={{ display: "flex", gap: ".5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de l'image ou uploadez un fichier"
          style={{ flex: 1, minWidth: 200 }}
        />
        <button
          type="button"
          className="btn-outline-sotip"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{ whiteSpace: "nowrap", padding: ".5rem .9rem", fontSize: ".8rem" }}
        >
          {uploading ? (
            <><i className="bi bi-arrow-repeat spin"></i> Upload...</>
          ) : (
            <><i className="bi bi-upload"></i> Parcourir</>
          )}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      {error && (
        <div style={{ color: "#dc3545", fontSize: ".75rem", marginTop: ".3rem" }}>{error}</div>
      )}
      {value && (
        <div style={{ marginTop: ".4rem" }}>
          <img
            src={value}
            alt=""
            style={{
              maxWidth: 120,
              maxHeight: 80,
              objectFit: "cover",
              border: "1px solid var(--line)",
              borderRadius: ".4rem",
            }}
          />
        </div>
      )}
    </div>
  );
}
