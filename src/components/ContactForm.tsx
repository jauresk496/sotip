'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ContactForm() {
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFormError('');

    const formData = new FormData(e.currentTarget);
    const nom = (formData.get('userName') as string)?.trim();
    const email = (formData.get('userEmail') as string)?.trim();
    const sujet = (formData.get('userSujet') as string)?.trim();
    const message = (formData.get('userMsg') as string)?.trim();

    if (!nom || !email || !message) {
      setFormError('Veuillez remplir tous les champs obligatoires (Nom, Email, Message).');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormError('Adresse email invalide.');
      setLoading(false);
      return;
    }

    if (message.length > 10000) {
      setFormError('Message trop long (max 10000 caractères).');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('contact_messages').insert({
      name: nom,
      email,
      subject: sujet || null,
      message,
    });

    if (error) {
      setFormError("Erreur lors de l'envoi. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    setFormSent(true);
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="form-card">
      <h3>Formulaire de contact</h3>
      {formSent && (
        <div className="form-success">
          <strong>Message envoyé avec succès !</strong> Nous vous répondrons dans les plus brefs délais.
        </div>
      )}
      {formError && (
        <div className="form-error">
          <strong>Erreur :</strong> {formError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userName">Nom *</label>
          <input type="text" id="userName" name="userName" required maxLength={100} />
        </div>
        <div className="form-group">
          <label htmlFor="userEmail">Email *</label>
          <input type="email" id="userEmail" name="userEmail" required maxLength={254} />
        </div>
        <div className="form-group">
          <label htmlFor="userSujet">Sujet</label>
          <input type="text" id="userSujet" name="userSujet" maxLength={200} />
        </div>
        <div className="form-group">
          <label htmlFor="userMsg">Message *</label>
          <textarea id="userMsg" name="userMsg" required maxLength={10000} />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer le message'}
        </button>
      </form>
    </div>
  );
}
