import nodemailer from 'nodemailer';
import { getResolvedSmtpTransportOptions } from '@/lib/app-settings';

export async function verifyConnection(): Promise<boolean> {
  try {
    const t = await getResolvedSmtpTransportOptions();
    const transporter = nodemailer.createTransport({
      host: t.host,
      port: t.port,
      secure: t.secure,
      auth: t.auth,
    });
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP connection verification failed:', error);
    return false;
  }
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
    contentType?: string;
  }>;
}

export async function sendMail(options: SendMailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const t = await getResolvedSmtpTransportOptions();
    const transporter = nodemailer.createTransport({
      host: t.host,
      port: t.port,
      secure: t.secure,
      auth: t.auth,
    });

    const mailOptions = {
      from: options.from || t.defaultFrom,
      to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      attachments: options.attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export const emailTemplates = {
  orderConfirmation: (data: { orderNumber: string; customerName: string; items: string }) => ({
    subject: `Potvrda narudžbe #${data.orderNumber} - Shirt Shop`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Hvala na narudžbi!</h1>
        <p>Poštovani/a ${data.customerName},</p>
        <p>Vaša narudžba <strong>#${data.orderNumber}</strong> je uspješno primljena.</p>
        <h3>Stavke narudžbe:</h3>
        ${data.items}
        <p>Kontaktirat ćemo vas uskoro s dodatnim informacijama.</p>
        <br>
        <p>S poštovanjem,<br>Shirt Shop tim</p>
      </div>
    `,
    text: `Hvala na narudžbi!\n\nPoštovani/a ${data.customerName},\n\nVaša narudžba #${data.orderNumber} je uspješno primljena.\n\nKontaktirat ćemo vas uskoro s dodatnim informacijama.\n\nS poštovanjem,\nShirt Shop tim`,
  }),

  orderStatusUpdate: (data: { orderNumber: string; customerName: string; status: string }) => ({
    subject: `Ažuriranje statusa narudžbe #${data.orderNumber} - Shirt Shop`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #7c3aed;">Ažuriranje narudžbe</h1>
        <p>Poštovani/a ${data.customerName},</p>
        <p>Status vaše narudžbe <strong>#${data.orderNumber}</strong> je ažuriran na: <strong>${data.status}</strong></p>
        <br>
        <p>S poštovanjem,<br>Shirt Shop tim</p>
      </div>
    `,
    text: `Ažuriranje narudžbe\n\nPoštovani/a ${data.customerName},\n\nStatus vaše narudžbe #${data.orderNumber} je ažuriran na: ${data.status}\n\nS poštovanjem,\nShirt Shop tim`,
  }),

  workerNotification: (data: {
    orderNumber: string;
    firstName: string;
    lastName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryMethod?: string;
    companyName?: string;
    companyId?: string;
    pdvNumber?: string;
    customerNotes?: string;
    items: Array<{
      productName: string;
      quantity: number;
      color?: string;
      size?: string;
      designImages?: string[];
      designCode?: string;
      areas?: string[];
      previewUrl?: string;
      texts?: Array<{
        content: string;
        area: string;
        fontSize: number;
        fontFamily: string;
        fontWeight: string;
        fontStyle: string;
        color: string;
      }>;
      editorType?: string;
    }>;
  }) => {
    const previewRow = data.items
      .map((item) => item.previewUrl)
      .filter((u): u is string => Boolean(u && /^https?:\/\//i.test(u)))

    const previewHeaderHtml =
      previewRow.length > 0
        ? `
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0 0 12px 0; font-size: 13px; color: #666;">Pregled dizajna:</p>
        <div style="line-height: 0;">
          ${previewRow
            .map(
              (src) =>
                `<img src="${src}" alt="Pregled" width="280" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px; margin: 0 8px 8px 0; display: inline-block; vertical-align: top;" />`
            )
            .join('')}
        </div>
      </div>`
        : '';

    const itemsHtml = data.items.map((item, index) => `
      <div style="margin-bottom: 16px; padding: 14px; background: #f5f5f5; border-radius: 8px;">
        <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${index + 1}. ${item.productName}</h3>
        <p style="margin: 4px 0; font-size: 14px;"><strong>Količina:</strong> ${item.quantity}</p>
        ${item.color ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Boja:</strong> ${item.color}</p>` : ''}
        ${item.size ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Veličina:</strong> ${item.size}</p>` : ''}
        ${item.areas && item.areas.length > 0 ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Područja:</strong> ${item.areas.join(', ')}</p>` : ''}
        ${item.designCode ? `<p style="margin: 4px 0; font-size: 14px;"><strong>Kod dizajna:</strong> ${item.designCode}</p>` : ''}
      </div>
    `).join('');

    const itemsText = data.items.map((item, index) => {
      let text = `${index + 1}. ${item.productName}\n   Količina: ${item.quantity}`;
      if (item.color) text += `\n   Boja: ${item.color}`;
      if (item.size) text += `\n   Veličina: ${item.size}`;
      if (item.areas && item.areas.length > 0) text += `\n   Područja: ${item.areas.join(', ')}`;
      if (item.designCode) text += `\n   Kod dizajna: ${item.designCode}`;
      return text;
    }).join('\n\n');

    return {
      subject: `shirtshop-${data.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">Nova narudžba: ${data.orderNumber}</h1>
          ${previewHeaderHtml}
          <p style="font-size: 14px; color: #444; margin: 0 0 20px 0;">
            <strong>Print datoteke</strong> šalju se u <strong>ZIP privitku</strong>.
          </p>
          
          <h2 style="color: #333; margin-top: 25px;">Podaci kupca</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 5px 0;"><strong>Ime:</strong></td><td>${data.firstName}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Prezime:</strong></td><td>${data.lastName}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
            <tr><td style="padding: 5px 0;"><strong>Telefon:</strong></td><td><a href="tel:${data.customerPhone}">${data.customerPhone}</a></td></tr>
            ${data.deliveryMethod ? `<tr><td style="padding: 5px 0;"><strong>Način:</strong></td><td>${data.deliveryMethod}</td></tr>` : ''}
            <tr><td style="padding: 5px 0;"><strong>Adresa:</strong></td><td>${data.address}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Grad:</strong></td><td>${data.postalCode} ${data.city}</td></tr>
            <tr><td style="padding: 5px 0;"><strong>Država:</strong></td><td>${data.country}</td></tr>
            ${data.companyName ? `<tr><td style="padding: 5px 0;"><strong>Firma:</strong></td><td>${data.companyName}</td></tr>` : ''}
            ${data.companyId ? `<tr><td style="padding: 5px 0;"><strong>ID broj firme:</strong></td><td>${data.companyId}</td></tr>` : ''}
            ${data.pdvNumber ? `<tr><td style="padding: 5px 0;"><strong>PDV broj:</strong></td><td>${data.pdvNumber}</td></tr>` : ''}
          </table>

          ${data.customerNotes ? `
            <h2 style="color: #333; margin-top: 25px;">Napomena kupca</h2>
            <p style="background: #fff3cd; padding: 10px; border-radius: 5px;">${data.customerNotes}</p>
          ` : ''}

          <h2 style="color: #333; margin-top: 25px;">Stavke narudžbe</h2>
          ${itemsHtml}
        </div>
      `,
      text: `NOVA NARUDŽBA: ${data.orderNumber}\n\n` +
        `PODACI KUPCA\n` +
        `Ime: ${data.firstName}\n` +
        `Prezime: ${data.lastName}\n` +
        `Email: ${data.customerEmail}\n` +
        `Telefon: ${data.customerPhone}\n` +
        (data.deliveryMethod ? `Način: ${data.deliveryMethod}\n` : '') +
        `Adresa: ${data.address}\n` +
        `Grad: ${data.postalCode} ${data.city}\n` +
        `Država: ${data.country}\n` +
        (data.companyName ? `Firma: ${data.companyName}\n` : '') +
        (data.companyId ? `ID broj firme: ${data.companyId}\n` : '') +
        (data.pdvNumber ? `PDV broj: ${data.pdvNumber}\n` : '') +
        (data.customerNotes ? `\nNAPOMENA KUPCA\n${data.customerNotes}\n` : '') +
        `\nSTAVKE NARUDŽBE\n${itemsText}`,
    };
  },
};
