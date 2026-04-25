import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const { email, code, customerName, customerPhone, items, total, locale } = await req.json();

    if (!email || !code || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Verify OTP
    const { data: otps } = await supabase
      .from('otps')
      .select('id, code, expires_at, used')
      .eq('email', email)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1);

    const otp = otps?.[0];
    if (!otp || otp.code !== code) return NextResponse.json({ error: 'invalid' }, { status: 400 });
    if (new Date(otp.expires_at) < new Date()) return NextResponse.json({ error: 'expired' }, { status: 400 });

    await supabase.from('otps').update({ used: true }).eq('id', otp.id);

    // Save order (no .select() — avoids needing SELECT policy with anon key)
    const { error: orderError } = await supabase
      .from('orders')
      .insert({ customer_name: customerName, customer_email: email, customer_phone: customerPhone || null, items, total, locale: locale || 'fr' });

    if (orderError) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    // Send confirmation emails
    const resendKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const restaurantEmail = process.env.RESTAURANT_EMAIL;

    if (resendKey && restaurantEmail) {
      const resend = new Resend(resendKey);
      const firstName = customerName?.split(' ')[0] || customerName;

      const itemRows = items.map((i: any) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8e0">${i.quantity}×</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8e0">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8e0;text-align:right">${(i.price * i.quantity).toFixed(2)} €</td>
        </tr>`).join('');

      const emailHtml = (forRestaurant: boolean) => `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1410">
          <div style="background:#c8102e;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:3px">ORIENT EXPRESS</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">
              ${forRestaurant ? 'Nouvelle commande à emporter' : 'Confirmation de commande'}
            </p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #e8e0d8">
            ${forRestaurant
              ? `<p style="margin:0 0 16px"><strong>${customerName}</strong> — <a href="mailto:${email}" style="color:#c8102e">${email}</a>${customerPhone ? ` — ${customerPhone}` : ''}</p>`
              : `<p style="margin:0 0 16px">Bonjour ${firstName},<br>Merci pour votre commande !</p>`
            }
            <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 16px">
              <thead>
                <tr style="background:#f5f0ea">
                  <th style="padding:8px 12px;text-align:left;font-weight:600">Qté</th>
                  <th style="padding:8px 12px;text-align:left;font-weight:600">Article</th>
                  <th style="padding:8px 12px;text-align:right;font-weight:600">Prix</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding:12px;font-weight:700;font-size:15px">Total</td>
                  <td style="padding:12px;font-weight:700;font-size:15px;text-align:right;color:#c8102e">${Number(total).toFixed(2)} €</td>
                </tr>
              </tfoot>
            </table>
            ${!forRestaurant ? `
              <div style="border-left:3px solid #c8102e;padding:12px 16px;background:#fff8f0;font-size:13px;color:#6b5e52">
                <strong style="color:#1a1410">Orient Express</strong><br>
                Wandstraat 16, 1020 Laeken, Bruxelles<br>
                Tél : <a href="tel:+3222620879" style="color:#c8102e">02 262 08 79</a>
              </div>` : ''}
          </div>
          <div style="padding:16px 32px;background:#f5f0ea;font-size:12px;color:#9a8878;text-align:center">
            Orient Express — Wandstraat 16, 1020 Laeken, Bruxelles
          </div>
        </div>`;

      await Promise.all([
        resend.emails.send({
          from: `Orient Express <${fromEmail}>`,
          to: [restaurantEmail],
          subject: `🥡 Commande à emporter — ${customerName} (${Number(total).toFixed(2)} €)`,
          html: emailHtml(true),
          replyTo: email,
        }),
        resend.emails.send({
          from: `Orient Express <${fromEmail}>`,
          to: [email],
          subject: `Votre commande chez Orient Express — confirmation`,
          html: emailHtml(false),
        }),
      ]).catch(err => console.error('Email error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
