import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function truncate(str: unknown, max: number): string {
  if (typeof str !== 'string') return '';
  return str.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = truncate(body.name, 200);
    const email = truncate(body.email, 200);
    const phone = truncate(body.phone, 50);
    const company = truncate(body.company, 200);
    const project_type = truncate(body.project_type, 100);
    const project_description = truncate(body.project_description, 5000);
    const budget = truncate(body.budget, 100);
    const deadline = truncate(body.deadline, 100);
    const attachments: string[] = Array.isArray(body.attachments)
      ? body.attachments.filter((u: unknown) => typeof u === 'string' && u.startsWith('http')).slice(0, 10)
      : [];

    if (!name || !email || !project_description) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER || 'contact.sotipci@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      console.warn('GMAIL_APP_PASSWORD non configuré - email non envoyé');
      return NextResponse.json({ success: true, warning: 'Email non configuré' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const attachmentsList = attachments.length > 0
      ? attachments.map((url: string) => `<li><a href="${esc(url)}">${esc(url.split('/').pop() || url)}</a></li>`).join('')
      : '<li>Aucune pièce jointe</li>';

    const html = `
      <h2>Nouvelle demande de devis - SOTIP-CI</h2>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nom</td><td style="padding:8px;border:1px solid #ddd;">${esc(name)}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Téléphone</td><td style="padding:8px;border:1px solid #ddd;">${esc(phone)}</td></tr>` : ''}
        ${company ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Entreprise</td><td style="padding:8px;border:1px solid #ddd;">${esc(company)}</td></tr>` : ''}
        ${project_type ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Type de projet</td><td style="padding:8px;border:1px solid #ddd;">${esc(project_type)}</td></tr>` : ''}
        ${budget ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:8px;border:1px solid #ddd;">${esc(budget)}</td></tr>` : ''}
        ${deadline ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Délai</td><td style="padding:8px;border:1px solid #ddd;">${esc(deadline)}</td></tr>` : ''}
      </table>
      <h3 style="font-family:Arial,sans-serif;">Description du projet</h3>
      <div style="padding:12px;background:#f7f9fa;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;">${esc(project_description)}</div>
      <h3 style="font-family:Arial,sans-serif;">Pièces jointes</h3>
      <ul style="font-family:Arial,sans-serif;font-size:14px;">${attachmentsList}</ul>
      <hr style="margin-top:20px;">
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;">Cet email a été envoyé automatiquement depuis le site SOTIP-CI.</p>
    `;

    await transporter.sendMail({
      from: gmailUser,
      to: 'contact.sotipci@gmail.com',
      replyTo: email,
      subject: `Nouvelle demande de devis - ${name.replace(/[\r\n]/g, ' ')}${project_type ? ` (${project_type.replace(/[\r\n]/g, ' ')})` : ''}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
