"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DocumentPrint from "@/components/gestion/DocumentPrint";

interface GestionDoc {
  id: string;
  doc_type: string;
  doc_number: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

export default function MonEspaceImprimerPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [doc, setDoc] = useState<GestionDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/gestion?id=${id}`)
      .then(async res => {
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          throw new Error(d.error || "Document introuvable");
        }
        return res.json();
      })
      .then(data => setDoc(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="print-page">
      <div className="print-toolbar no-print">
        <Link href="/mon-espace" className="print-btn print-btn-ghost">
          ← Retour
        </Link>
        <button onClick={() => window.print()} className="print-btn print-btn-primary">
          🖨 Imprimer / Enregistrer en PDF
        </button>
      </div>
      {loading && <div style={{ textAlign: "center", padding: "3rem", color: "#6b7c8a" }}>Chargement du document...</div>}
      {error && <div style={{ textAlign: "center", padding: "3rem", color: "#a11a1a" }}>{error}</div>}
      {doc && <DocumentPrint doc={doc} />}
    </div>
  );
}
