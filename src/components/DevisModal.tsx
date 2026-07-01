'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const PROJECT_TYPES = [
  'Construction métallique',
  'Charpenterie métallique',
  'Chaudronnerie',
  'Tuyauterie',
  'Génie civil',
  'Maintenance industrielle',
  'Autre',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;
const ALLOWED_EXTS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'dwg', 'dxf', 'zip'];

export default function DevisModal() {
  const [open, setOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-devis-modal', handler);
    return () => window.removeEventListener('open-devis-modal', handler);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const resetForm = () => {
    setFormSent(false);
    setFormError('');
    setFiles([]);
    setFileNames([]);
  };

  const closeModal = () => {
    setOpen(false);
    setTimeout(resetForm, 300);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFormError('');

    const valid: File[] = [];
    for (const f of selected) {
      if (files.length + valid.length >= MAX_FILES) {
        setFormError(`Maximum ${MAX_FILES} fichiers autorisés.`);
        break;
      }
      if (f.size > MAX_FILE_SIZE) {
        setFormError(`Le fichier "${f.name}" dépasse la taille maximale de 10 Mo.`);
        continue;
      }
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      if (!ALLOWED_EXTS.includes(ext)) {
        setFormError(`Type de fichier non autorisé: ${f.name}`);
        continue;
      }
      valid.push(f);
    }

    setFiles(prev => [...prev, ...valid]);
    setFileNames(prev => [...prev, ...valid.map(f => f.name)]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileNames(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const nom = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const phone = (formData.get('phone') as string)?.trim();
    const company = (formData.get('company') as string)?.trim();
    const projectType = (formData.get('project_type') as string)?.trim();
    const description = (formData.get('project_description') as string)?.trim();
    const budget = (formData.get('budget') as string)?.trim();
    const deadline = (formData.get('deadline') as string)?.trim();

    if (!nom || !email || !description) {
      setFormError('Veuillez remplir les champs obligatoires (Nom, Email, Description du projet).');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Adresse email invalide.');
      setLoading(false);
      return;
    }

    let attachmentUrls: string[] = [];

    if (files.length > 0) {
      for (const file of files) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const fileName = `quotes/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('quotes')
          .upload(fileName, file, { upsert: false });

        if (uploadError) {
          setFormError(`Erreur lors de l'envoi du fichier "${file.name}". Veuillez réessayer.`);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('quotes')
          .getPublicUrl(fileName);

        attachmentUrls.push(urlData.publicUrl);
      }
    }

    const { error } = await supabase.from('quote_requests').insert({
      name: nom,
      email,
      phone: phone || null,
      company: company || null,
      project_type: projectType || null,
      project_description: description,
      budget: budget || null,
      deadline: deadline || null,
      attachments: attachmentUrls,
    });

    if (error) {
      setFormError("Erreur lors de l'envoi de votre demande. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    try {
      await fetch('/api/devis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nom,
          email,
          phone: phone || null,
          company: company || null,
          project_type: projectType || null,
          project_description: description,
          budget: budget || null,
          deadline: deadline || null,
          attachments: attachmentUrls,
        }),
      });
    } catch {
      // Email failure should not block the user's success
    }

    setFormSent(true);
    setLoading(false);
    setFiles([]);
    setFileNames([]);
    (e.target as HTMLFormElement).reset();
  };

  if (!open) return null;

  return (
    <div className="devis-overlay" onClick={closeModal}>
      <div className="devis-modal" ref={dialogRef} onClick={e => e.stopPropagation()}>
        <div className="devis-modal-head">
          <h3>Demande de devis</h3>
          <button className="devis-modal-close" onClick={closeModal} aria-label="Fermer">&times;</button>
        </div>
        <div className="devis-modal-body">
          {formSent ? (
            <div className="form-success">
              <strong>Demande envoyée avec succès !</strong>
              <p style={{ marginTop: '8px' }}>Nous vous répondrons dans les plus brefs délais. Merci de votre confiance.</p>
              <button className="btn" style={{ marginTop: '16px' }} onClick={closeModal}>Fermer</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {formError && (
                <div className="form-error">
                  <strong>Erreur :</strong> {formError}
                </div>
              )}
              <div className="devis-form-row">
                <div className="form-group">
                  <label htmlFor="devis-name">Nom complet *</label>
                  <input type="text" id="devis-name" name="name" required maxLength={100} />
                </div>
                <div className="form-group">
                  <label htmlFor="devis-email">Email *</label>
                  <input type="email" id="devis-email" name="email" required maxLength={254} />
                </div>
              </div>
              <div className="devis-form-row">
                <div className="form-group">
                  <label htmlFor="devis-phone">Téléphone</label>
                  <input type="tel" id="devis-phone" name="phone" maxLength={30} />
                </div>
                <div className="form-group">
                  <label htmlFor="devis-company">Entreprise</label>
                  <input type="text" id="devis-company" name="company" maxLength={200} />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="devis-type">Type de projet</label>
                <select id="devis-type" name="project_type" defaultValue="">
                  <option value="" disabled>Sélectionnez un type de projet</option>
                  {PROJECT_TYPES.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="devis-description">Description du projet *</label>
                <textarea
                  id="devis-description"
                  name="project_description"
                  required
                  maxLength={10000}
                  placeholder="Décrivez votre projet en détail : nature des travaux, dimensions, quantités, contraintes particulières..."
                />
              </div>
              <div className="devis-form-row">
                <div className="form-group">
                  <label htmlFor="devis-budget">Budget estimatif</label>
                  <input type="text" id="devis-budget" name="budget" maxLength={100} placeholder="Ex: 5 000 000 FCFA" />
                </div>
                <div className="form-group">
                  <label htmlFor="devis-deadline">Délai souhaité</label>
                  <input type="text" id="devis-deadline" name="deadline" maxLength={100} placeholder="Ex: 3 mois" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="devis-files">Pièces jointes (max {MAX_FILES} fichiers, 10 Mo/fichier)</label>
                <div className="devis-file-zone">
                  <input
                    type="file"
                    id="devis-files"
                    multiple
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.dwg,.dxf,.zip"
                  />
                  <div className="devis-file-hint">
                    <span>&#128206;</span>
                    <p>Cliquez pour ajouter des fichiers</p>
                    <p className="devis-file-formats">PDF, DOC, XLS, JPG, PNG, DWG, ZIP...</p>
                  </div>
                </div>
                {fileNames.length > 0 && (
                  <div className="devis-file-list">
                    {fileNames.map((name, i) => (
                      <div key={i} className="devis-file-item">
                        <span className="devis-file-name">&#128206; {name}</span>
                        <button type="button" className="devis-file-remove" onClick={() => removeFile(i)}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" className="btn devis-submit-btn" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
