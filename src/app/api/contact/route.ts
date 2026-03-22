import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactPayload = {
  nome?: string;
  email?: string;
  mensagem?: string;
};

const CONTACT_DESTINATION = 'experimentanaturalmente@gmail.com';

const isValidEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);
const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const nome = body.nome?.trim() || '';
    const email = body.email?.trim() || '';
    const mensagem = body.mensagem?.trim() || '';
    const safeNome = escapeHtml(nome);
    const safeEmail = escapeHtml(email);
    const safeMensagem = escapeHtml(mensagem);

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { success: false, message: 'Nome, Email e Mensagem sao obrigatorios.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Email informado eh invalido.' },
        { status: 400 },
      );
    }

    if (nome.length > 120 || email.length > 320 || mensagem.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'Um ou mais campos ultrapassam o tamanho permitido.' },
        { status: 400 },
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || smtpUser;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        {
          success: false,
          message: 'Servico de email nao configurado no servidor.',
        },
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: CONTACT_DESTINATION,
      replyTo: email,
      subject: `[Contato Site] ${nome}`,
      text: [
        'Nova mensagem enviada pelo formulario de contato.',
        '',
        `Nome: ${nome}`,
        `Email: ${email}`,
        '',
        'Mensagem:',
        mensagem,
      ].join('\n'),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #2f2f2f;">
          <h2 style="margin-bottom: 8px;">Nova mensagem de contato</h2>
          <p style="margin: 0 0 12px;"><strong>Nome:</strong> ${safeNome}</p>
          <p style="margin: 0 0 12px;"><strong>Email:</strong> ${safeEmail}</p>
          <p style="margin: 0 0 8px;"><strong>Mensagem:</strong></p>
          <p style="white-space: pre-wrap; margin: 0;">${safeMensagem}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso.' });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Nao foi possivel enviar a mensagem no momento.',
      },
      { status: 500 },
    );
  }
}
