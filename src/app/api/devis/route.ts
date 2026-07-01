import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, project_type, project_description, budget, deadline, attachments } = body;

    if (!name || !email || !project_description) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
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

    const attachmentsList = attachments && attachments.length > 0
      ? attachments.map((url: string) => `<li><a href="${url}">${url.split('/').pop()}</a></li>`).join('')
      : '<li>Aucune pièce jointe</li>';

    const html = `
      <h2>Nouvelle demande de devis - SOTIP-CI</h2>
      <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nom</td><td style="padding:8px;border:1px solid #ddd;">${name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
        ${phone ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Téléphone</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>` : ''}
        ${company ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Entreprise</td><td style="padding:8px;border:1px solid #ddd;">${company}</td></tr>` : ''}
        ${project_type ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Type de projet</td><td style="padding:8px;border:1px solid #ddd;">${project_type}</td></tr>` : ''}
        ${budget ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Budget</td><td style="padding:8px;border:1px solid #ddd;">${budget}</td></tr>` : ''}
        ${deadline ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Délai</td><td style="padding:8px;border:1px solid #ddd;">${deadline}</td></tr>` : ''}
      </table>
      <h3 style="font-family:Arial,sans-serif;">Description du projet</h3>
      <div style="padding:12px;background:#f7f9fa;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;">${project_description}</div>
      <h3 style="font-family:Arial,sans-serif;">Pièces jointes</h3>
      <ul style="font-family:Arial,sans-serif;font-size:14px;">${attachmentsList}</ul>
      <hr style="margin-top:20px;">
      <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;">Cet email a été envoyé automatiquement depuis le site SOTIP-CI.</p>
    `;

    await transporter.sendMail({
      from: gmailUser,
      to: 'contact.sotipci@gmail.com',
      replyTo: email,
      subject: `Nouvelle demande de devis - ${name}${project_type ? ` (${project_type})` : ''}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Erreur envoi email:', err);
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
  }
}
