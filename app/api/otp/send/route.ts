import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { Resend } from 'resend';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const supabase = createServerClient();
    await supabase.from('otps').update({ used: true }).eq('email', email).eq('used', false);

    const { error: dbError } = await supabase.from('otps').insert({
      email,
      code,
      expires_at: expiresAt.toISOString(),
    });
    if (dbError) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.log(`[DEV] OTP for ${email}: ${code}`);
      return NextResponse.json({ success: true, dev: true });
    }

    const resend = new Resend(resendKey);
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
    const firstName = name?.split(' ')[0] || '';

    const { error: emailError } = await resend.emails.send({
      from: `Orient Express <${fromEmail}>`,
      to: [email],
      subject: `${code} — Votre code de vérification / Uw verificatiecode`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;color:#1a1410">
          <div style="background:#c8102e;padding:24px 32px">
            <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:3px">ORIENT EXPRESS</h1>
            <p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:13px">Cuisine Chinoise — De Wand, Bruxelles</p>
          </div>
          <div style="padding:32px;background:#fff;border:1px solid #e8e0d8">
            ${firstName ? `<p style="margin:0 0 16px;font-size:15px">Bonjour ${firstName},</p>` : ''}
            <p style="margin:0 0 24px;color:#6b5e52;line-height:1.6">
              Voici votre code pour confirmer votre commande à emporter :
            </p>
            <div style="text-align:center;margin:0 0 24px">
              <span style="display:inline-block;background:#fff8f0;border:2px solid #c8102e;border-radius:8px;padding:16px 40px;font-size:36px;font-weight:700;letter-spacing:10px;color:#c8102e">
                ${code}
              </span>
            </div>
            <p style="margin:0;color:#9a8878;font-size:13px;text-align:center">
              Ce code expire dans <strong>10 minutes</strong>.<br>
              Als u geen bestelling heeft geplaatst, negeer dan deze e-mail.
            </p>
          </div>
          <div style="padding:16px 32px;background:#f5f0ea;font-size:12px;color:#9a8878;text-align:center">
            Orient Express — Wandstraat 16, 1020 Laeken, Bruxelles
          </div>
        </div>`,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
