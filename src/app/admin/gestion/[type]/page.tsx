"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import AdminShell from "@/components/AdminShell";

interface GestionDoc {
  id: string;
  doc_type: string;
  doc_number: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
}

interface SortieItem {
  type?: "item" | "titre";
  designation: string;
  quantite: string;
  destination: string;
  observations: string;
}

const TYPE_CONFIG: Record<string, { label: string; icon: string }> = {
  bon_caisse: { label: "Bon de Caisse", icon: "bi-cash-stack" },
  recu: { label: "Reçu", icon: "bi-receipt" },
  bon_sortie: { label: "Bon de Sortie", icon: "bi-box-arrow-right" },
};

const EMPTY_BON_CAISSE: Record<string, unknown> = {
  date: new Date().toISOString().slice(0, 10),
  sens: "entree",
  montant: "",
  recu_de: "",
  montant_lettre: "",
  motif: "",
  avance: "",
  reste: "",
  ordre_donne_par: "",
  mode: "cash",
  depot_detail: "",
  compte: "entreprise",
};

const EMPTY_RECU: Record<string, unknown> = {
  date: new Date().toISOString().slice(0, 10),
  bpf: "",
  recu_de: "",
  somme: "",
  articles: "",
  avance: "",
  reste: "",
  etabli_par: "",
};

const EMPTY_BON_SORTIE: Record<string, unknown> = {
  date: new Date().toISOString().slice(0, 10),
  nom_emetteur: "",
  service: "",
  items: [{ type: "item", designation: "", quantite: "", destination: "", observations: "" }] as SortieItem[],
};

const EMPTY_BY_TYPE: Record<string, Record<string, unknown>> = {
  bon_caisse: EMPTY_BON_CAISSE,
  recu: EMPTY_RECU,
  bon_sortie: EMPTY_BON_SORTIE,
};

export default function GestionTypePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const docType = String(params.type || "");
  const config = TYPE_CONFIG[docType];

  const [docs, setDocs] = useState<GestionDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<GestionDoc | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/gestion?doc_type=${docType}`);
      const data = await res.json();
      setDocs(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    setLoading(false);
  }, [docType]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (searchParams.get("new") === "1") openNew();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function openNew() {
    setEditing(null);
    setForm({ ...(EMPTY_BY_TYPE[docType] || {}) });
    setError("");
  }

  function openEdit(doc: GestionDoc) {
    setEditing(doc);
    setForm({ ...doc.data });
    setError("");
  }

  function closeForm() {
    setEditing(null);
    setForm({});
  }

  const isFormOpen = editing !== null || Object.keys(form).length > 0;

  function setField(key: string, value: unknown) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function setItem(idx: number, key: keyof SortieItem, value: string) {
    const items = [...((form.items as SortieItem[]) || [])];
    items[idx] = { ...items[idx], [key]: value };
    setForm(prev => ({ ...prev, items }));
  }

  function addItem() {
    const items = [...((form.items as SortieItem[]) || [])];
    items.push({ type: "item", designation: "", quantite: "", destination: "", observations: "" });
    setForm(prev => ({ ...prev, items }));
  }

  function addTitre() {
    const items = [...((form.items as SortieItem[]) || [])];
    items.push({ type: "titre", designation: "", quantite: "", destination: "", observations: "" });
    setForm(prev => ({ ...prev, items }));
  }

  function removeItem(idx: number) {
    const items = ((form.items as SortieItem[]) || []).filter((_, i) => i !== idx);
    setForm(prev => ({ ...prev, items }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/gestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editing?.id,
        doc_type: docType,
        data: form,
      }),
    });

    if (res.ok) {
      setMsg(editing ? "Document mis à jour." : "Document créé.");
      setTimeout(() => setMsg(""), 3000);
      closeForm();
      load();
    } else {
      const d = await res.json();
      setError(d.error || "Erreur lors de l'enregistrement.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce document définitivement ?")) return;
    await fetch(`/api/admin/gestion?id=${id}`, { method: "DELETE" });
    load();
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

  if (!config) {
    return (
      <AdminShell>
        <div className="alert alert-danger">Type de document inconnu : {docType}</div>
        <Link href="/admin/gestion" className="btn-outline-sotip" style={{ textDecoration: "none" }}>Retour au tableau de bord</Link>
      </AdminShell>
    );
  }

  const inputStyle: React.CSSProperties = { width: "100%" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: ".78rem", fontWeight: 700, color: "var(--muted)", marginBottom: ".25rem", textTransform: "uppercase" };
  const fieldStyle: React.CSSProperties = { marginBottom: ".8rem" };
  const rowStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem" };

  return (
    <AdminShell>
      <div className="page-head">
        <div>
          <h1 className="ph-title"><i className={`bi ${config.icon}`}></i> {config.label}</h1>
          <p className="ph-sub">{docs.length} document{docs.length > 1 ? "s" : ""}</p>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href="/admin/gestion" className="btn-outline-sotip" style={{ textDecoration: "none", padding: ".45rem 1rem", fontSize: ".85rem" }}>
            <i className="bi bi-arrow-left"></i> Tableau de bord
          </Link>
          <button className="btn-sotip" onClick={openNew}>
            <i className="bi bi-plus-lg"></i> Nouveau document
          </button>
        </div>
      </div>

      {msg && <div className="alert alert-success">{msg}</div>}

      <div className="adm-card">
        <div className="adm-card-body" style={{ padding: 0, overflowX: "auto" }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>N° Document</th>
                <th>Date</th>
                <th>Référence / Bénéficiaire</th>
                {docType === "bon_caisse" && <th>Montant</th>}
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: 700, fontSize: ".8rem" }}>{doc.doc_number}</td>
                  <td>{formatDate(String(doc.data?.date || doc.created_at))}</td>
                  <td>{String(doc.data?.recu_de || doc.data?.nom_emetteur || "—")}</td>
                  {docType === "bon_caisse" && (
                    <td style={{ fontWeight: 700 }}>
                      {doc.data?.montant ? `${Number(doc.data.montant).toLocaleString("fr-FR")} F` : "—"}
                      <span style={{ marginLeft: ".4rem", fontSize: ".7rem", padding: ".1rem .45rem", borderRadius: "1rem", background: doc.data?.sens === "entree" ? "rgba(160,200,60,.15)" : "rgba(220,53,69,.12)", color: doc.data?.sens === "entree" ? "#5a7a1c" : "#a11a1a" }}>
                        {doc.data?.sens === "entree" ? "Entrée" : "Sortie"}
                      </span>
                    </td>
                  )}
                  <td>
                    <div style={{ display: "flex", gap: ".35rem" }}>
                      <Link href={`/admin/gestion/imprimer/${doc.id}`} target="_blank" className="btn-sotip" style={{ padding: ".3rem .6rem", fontSize: ".75rem", textDecoration: "none" }} title="Imprimer / PDF">
                        <i className="bi bi-printer"></i>
                      </Link>
                      <button onClick={() => openEdit(doc)} className="btn-outline-sotip" style={{ padding: ".3rem .6rem", fontSize: ".75rem" }} title="Modifier">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button onClick={() => handleDelete(doc.id)} className="btn-danger" style={{ padding: ".3rem .6rem", fontSize: ".75rem" }} title="Supprimer">
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && docs.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>
                    Aucun document. Cliquez sur « Nouveau document » pour commencer.
                  </td>
                </tr>
              )}
              {loading && (
                <tr><td colSpan={5} style={{ textAlign: "center", padding: "2rem", color: "#6b7c8a" }}>Chargement...</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-card" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="modal-head">
                <h3>{editing ? `Modifier ${editing.doc_number}` : `Nouveau ${config.label}`}</h3>
                <button type="button" onClick={closeForm} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--muted)" }}>&times;</button>
              </div>
              <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {error && <div className="alert alert-danger">{error}</div>}

                <div style={rowStyle}>
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Date</label>
                    <input type="date" className="form-control" style={inputStyle} value={String(form.date || "")} onChange={e => setField("date", e.target.value)} required />
                  </div>
                  {docType === "bon_caisse" && (
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Sens de l'opération</label>
                      <div style={{ display: "flex", gap: "1rem", paddingTop: ".4rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                          <input type="radio" name="sens" checked={form.sens === "entree"} onChange={() => setField("sens", "entree")} /> Entrée
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                          <input type="radio" name="sens" checked={form.sens === "sortie"} onChange={() => setField("sens", "sortie")} /> Sortie
                        </label>
                      </div>
                    </div>
                  )}
                  {docType === "recu" && (
                    <div style={fieldStyle}>
                      <label style={labelStyle}>N° BPF</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.bpf || "")} onChange={e => setField("bpf", e.target.value)} />
                    </div>
                  )}
                </div>

                {docType === "bon_caisse" && (
                  <>
                    <div style={rowStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Montant (F. CFA)</label>
                        <input type="number" min="0" className="form-control" style={inputStyle} value={String(form.montant || "")} onChange={e => setField("montant", e.target.value)} required />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Reçu de Mr / Mme</label>
                        <input type="text" className="form-control" style={inputStyle} value={String(form.recu_de || "")} onChange={e => setField("recu_de", e.target.value)} required />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Montant en lettres</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.montant_lettre || "")} onChange={e => setField("montant_lettre", e.target.value)} placeholder="Ex: Cinq cent mille francs CFA" />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Motif</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.motif || "")} onChange={e => setField("motif", e.target.value)} />
                    </div>
                    <div style={rowStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Avance (F. CFA)</label>
                        <input type="number" min="0" className="form-control" style={inputStyle} value={String(form.avance || "")} onChange={e => setField("avance", e.target.value)} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Reste (F. CFA)</label>
                        <input type="number" min="0" className="form-control" style={inputStyle} value={String(form.reste || "")} onChange={e => setField("reste", e.target.value)} />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Ordre donné par</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.ordre_donne_par || "")} onChange={e => setField("ordre_donne_par", e.target.value)} />
                    </div>
                    <div style={rowStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Mode</label>
                        <div style={{ display: "flex", gap: "1rem", paddingTop: ".4rem" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                            <input type="radio" name="mode" checked={form.mode === "cash"} onChange={() => setField("mode", "cash")} /> Cash
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                            <input type="radio" name="mode" checked={form.mode === "depot"} onChange={() => setField("mode", "depot")} /> Dépôt
                          </label>
                        </div>
                      </div>
                      {form.mode === "depot" && (
                        <div style={fieldStyle}>
                          <label style={labelStyle}>Détail du dépôt</label>
                          <input type="text" className="form-control" style={inputStyle} value={String(form.depot_detail || "")} onChange={e => setField("depot_detail", e.target.value)} />
                        </div>
                      )}
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Compte</label>
                      <div style={{ display: "flex", gap: "1rem", paddingTop: ".4rem" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                          <input type="radio" name="compte" checked={form.compte === "personnel"} onChange={() => setField("compte", "personnel")} /> Pour compte personnel
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: ".4rem", cursor: "pointer" }}>
                          <input type="radio" name="compte" checked={form.compte === "entreprise"} onChange={() => setField("compte", "entreprise")} /> Pour le compte entreprise
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {docType === "recu" && (
                  <>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Reçu de M. / Mme</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.recu_de || "")} onChange={e => setField("recu_de", e.target.value)} required />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>La somme de (en lettres)</label>
                      <textarea className="form-control" rows={2} style={inputStyle} value={String(form.somme || "")} onChange={e => setField("somme", e.target.value)} required placeholder="Ex: Un million cinq cent mille francs CFA" />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Article(s)</label>
                      <textarea className="form-control" rows={2} style={inputStyle} value={String(form.articles || "")} onChange={e => setField("articles", e.target.value)} />
                    </div>
                    <div style={rowStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Avance</label>
                        <input type="text" className="form-control" style={inputStyle} value={String(form.avance || "")} onChange={e => setField("avance", e.target.value)} />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Reste</label>
                        <input type="text" className="form-control" style={inputStyle} value={String(form.reste || "")} onChange={e => setField("reste", e.target.value)} />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Reçu établi par</label>
                      <input type="text" className="form-control" style={inputStyle} value={String(form.etabli_par || "")} onChange={e => setField("etabli_par", e.target.value)} />
                    </div>
                  </>
                )}

                {docType === "bon_sortie" && (
                  <>
                    <div style={rowStyle}>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Nom émetteur</label>
                        <input type="text" className="form-control" style={inputStyle} value={String(form.nom_emetteur || "")} onChange={e => setField("nom_emetteur", e.target.value)} required />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Service</label>
                        <input type="text" className="form-control" style={inputStyle} value={String(form.service || "")} onChange={e => setField("service", e.target.value)} />
                      </div>
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Articles</label>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: ".85rem" }}>
                        <thead>
                          <tr style={{ background: "#f0f4f7" }}>
                            <th style={{ padding: ".4rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Désignation</th>
                            <th style={{ padding: ".4rem", textAlign: "left", border: "1px solid #e2e8f0", width: 90 }}>Quantité</th>
                            <th style={{ padding: ".4rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Destination</th>
                            <th style={{ padding: ".4rem", textAlign: "left", border: "1px solid #e2e8f0" }}>Observations</th>
                            <th style={{ border: "1px solid #e2e8f0", width: 40 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {((form.items as SortieItem[]) || []).map((item, i) => (
                            item.type === "titre" ? (
                              <tr key={i} style={{ background: "#eef4d9" }}>
                                <td colSpan={4} style={{ border: "1px solid #e2e8f0", padding: ".2rem" }}>
                                  <input type="text" className="form-control" value={item.designation} onChange={e => setItem(i, "designation", e.target.value)} style={{ border: "none", fontWeight: 700 }} placeholder="Titre de section (ex: Matériel de soudure)" />
                                </td>
                                <td style={{ border: "1px solid #e2e8f0", textAlign: "center" }}>
                                  <button type="button" onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: "#a11a1a", cursor: "pointer" }}>
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </td>
                              </tr>
                            ) : (
                              <tr key={i}>
                                <td style={{ border: "1px solid #e2e8f0", padding: ".2rem" }}>
                                  <input type="text" className="form-control" value={item.designation} onChange={e => setItem(i, "designation", e.target.value)} style={{ border: "none" }} />
                                </td>
                                <td style={{ border: "1px solid #e2e8f0", padding: ".2rem" }}>
                                  <input type="text" className="form-control" value={item.quantite} onChange={e => setItem(i, "quantite", e.target.value)} style={{ border: "none" }} />
                                </td>
                                <td style={{ border: "1px solid #e2e8f0", padding: ".2rem" }}>
                                  <input type="text" className="form-control" value={item.destination} onChange={e => setItem(i, "destination", e.target.value)} style={{ border: "none" }} />
                                </td>
                                <td style={{ border: "1px solid #e2e8f0", padding: ".2rem" }}>
                                  <input type="text" className="form-control" value={item.observations} onChange={e => setItem(i, "observations", e.target.value)} style={{ border: "none" }} />
                                </td>
                                <td style={{ border: "1px solid #e2e8f0", textAlign: "center" }}>
                                  <button type="button" onClick={() => removeItem(i)} style={{ background: "none", border: "none", color: "#a11a1a", cursor: "pointer" }}>
                                    <i className="bi bi-x-lg"></i>
                                  </button>
                                </td>
                              </tr>
                            )
                          ))}
                        </tbody>
                      </table>
                      <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
                        <button type="button" className="btn-outline-sotip" onClick={addItem} style={{ padding: ".35rem .8rem", fontSize: ".8rem" }}>
                          <i className="bi bi-plus-lg"></i> Ajouter une ligne
                        </button>
                        <button type="button" className="btn-outline-sotip" onClick={addTitre} style={{ padding: ".35rem .8rem", fontSize: ".8rem" }}>
                          <i className="bi bi-type-bold"></i> Ajouter un titre
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-foot">
                <button type="button" className="btn-outline-sotip" onClick={closeForm}>Annuler</button>
                <button type="submit" className="btn-sotip" disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
