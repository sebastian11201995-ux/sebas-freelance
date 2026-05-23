'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { contactSchema } from '@/lib/validations/contact'
import { headers } from 'next/headers'
import crypto from 'crypto'

const RATE_LIMIT_MAX    = 3
const RATE_LIMIT_WINDOW = 10

function sanitize(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"]/g, '')
    .trim()
}

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'sebas-salt-2025').digest('hex').slice(0, 16)
}

/* ── Google Sheets Webhook Connection ───────────────────────── */
async function postToGoogleSheets(data: {
  name: string
  email: string
  company: string | null
  service_interest: string | null
  message: string
}) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    console.warn('[postToGoogleSheets] Webhook URL no configurada.')
    return
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company,
        service_interest: data.service_interest,
        message: data.message,
      }),
    })

    if (!res.ok) {
      console.error('[postToGoogleSheets] Error en webhook:', res.statusText)
    }
  } catch (err) {
    console.error('[postToGoogleSheets] Error al enviar a Google Sheets:', err)
  }
}

/* ── Resend Email Notifications (Client & Owner) ───────────── */
async function sendEmailNotifications(data: {
  name: string
  email: string
  company: string | null
  service_interest: string | null
  message: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || 'sebastian11201995@gmail.com'
  const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '573108356778'

  if (!apiKey) {
    console.warn('[sendEmailNotifications] RESEND_API_KEY no configurada. Saltando envío de correos.')
    return
  }

  const service = data.service_interest || 'General'
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hola Sebastián, acabo de enviar mi solicitud de proyecto por tu web sobre el servicio "${service}". Mi nombre es ${data.name}.`
  )}`

  // 1. Correo al Cliente (Tarjeta HTML Premium)
  const clientHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirmación de Solicitud - Sebastián Barrera</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f0e0d; color: #f5efe1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f0e0d; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #141312; border: 1px solid #d8aa5d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6);">
          
          <!-- Header (Monogram logo) -->
          <tr>
            <td align="center" style="padding: 40px 40px 20px 40px; border-bottom: 1px solid rgba(216, 170, 93, 0.15);">
              <div style="width: 50px; height: 50px; line-height: 50px; text-align: center; border: 1px solid #d8aa5d; border-radius: 50%; color: #d8aa5d; font-family: Georgia, serif; font-size: 20px; font-weight: bold; margin-bottom: 15px; display: inline-block;">SB</div>
              <h2 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 22px; letter-spacing: 1.5px; font-weight: normal; text-transform: uppercase;">SEBASTIÁN BARRERA</h2>
              <p style="margin: 5px 0 0 0; color: #d8aa5d; font-size: 11px; letter-spacing: 2px; text-transform: uppercase;">Consultor de Datos &amp; Calidad</p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <h3 style="margin: 0 0 20px 0; color: #ffffff; font-family: Georgia, serif; font-size: 20px; font-weight: normal;">Hola, ${data.name}:</h3>
              <p style="margin: 0 0 20px 0; color: #c4bfa5; font-size: 15px; line-height: 1.6;">
                He recibido con éxito tu solicitud de contacto a través de mi sitio web. 
                Estoy analizando los detalles de tu necesidad para preparar una propuesta personalizada adaptada a tu operación.
              </p>
              
              <!-- Lead Details Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="12" style="background-color: rgba(216, 170, 93, 0.04); border: 1px solid rgba(216, 170, 93, 0.15); border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td width="35%" style="color: #d8aa5d; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid rgba(216, 170, 93, 0.08);">Servicio de Interés</td>
                  <td style="color: #ffffff; font-size: 14px; border-bottom: 1px solid rgba(216, 170, 93, 0.08);">${service}</td>
                </tr>
                ${data.company ? `
                <tr>
                  <td style="color: #d8aa5d; font-size: 13px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid rgba(216, 170, 93, 0.08);">Empresa</td>
                  <td style="color: #ffffff; font-size: 14px; border-bottom: 1px solid rgba(216, 170, 93, 0.08);">${data.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="color: #d8aa5d; font-size: 13px; font-weight: bold; text-transform: uppercase; vertical-align: top;">Tu mensaje</td>
                  <td style="color: #c4bfa5; font-size: 14px; line-height: 1.5; font-style: italic;">"${data.message}"</td>
                </tr>
              </table>

              <p style="margin: 0 0 30px 0; color: #c4bfa5; font-size: 14px; line-height: 1.6;">
                <strong>¿Qué sigue ahora?</strong><br>
                Te enviaré una respuesta detallada en un plazo máximo de 24 horas. Si deseas agilizar el proceso e iniciar una conversación directa, puedes escribirme de inmediato por WhatsApp.
              </p>

              <!-- Button CTA -->
              <table border="0" cellspacing="0" cellpadding="0" align="center" style="margin-top: 10px;">
                <tr>
                  <td align="center" style="background-color: #d8aa5d; border-radius: 30px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; padding: 14px 32px; color: #000000; font-size: 14px; font-weight: bold; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">Chatear por WhatsApp</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 40px 40px 40px; border-top: 1px solid rgba(216, 170, 93, 0.15); background-color: #100f0e;">
              <p style="margin: 0; color: #8e8a75; font-size: 12px;">© ${new Date().getFullYear()} Johan Sebastián Barrera Bustos. Todos los derechos reservados.</p>
              <p style="margin: 8px 0 0 0; color: #8e8a75; font-size: 11px;">Este es un mensaje automático de confirmación de solicitud.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  // 2. Correo al Propietario (Sebastián)
  const ownerHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nueva Solicitud - Sebastián Barrera</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f0e0d; color: #f5efe1; font-family: sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f0e0d; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table width="580" border="0" cellspacing="0" cellpadding="0" style="background-color: #141312; border: 1px solid #d8aa5d; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding: 30px; border-bottom: 1px solid rgba(216, 170, 93, 0.15); background-color: #100f0e;">
              <h2 style="margin: 0; color: #ffffff; font-size: 18px; font-family: Georgia, serif;">🔔 Nueva Solicitud Recibida</h2>
              <p style="margin: 5px 0 0 0; color: #d8aa5d; font-size: 12px;">Lead registrado en la landing page</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="10" style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px;">
                <tr>
                  <td width="30%" style="color: #d8aa5d; font-size: 12px; font-weight: bold; text-transform: uppercase;">Nombre</td>
                  <td style="color: #ffffff; font-size: 14px;">${data.name}</td>
                </tr>
                <tr>
                  <td style="color: #d8aa5d; font-size: 12px; font-weight: bold; text-transform: uppercase;">Email</td>
                  <td style="color: #ffffff; font-size: 14px;"><a href="mailto:${data.email}" style="color: #d8aa5d; text-decoration: underline;">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="color: #d8aa5d; font-size: 12px; font-weight: bold; text-transform: uppercase;">Empresa</td>
                  <td style="color: #ffffff; font-size: 14px;">${data.company || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="color: #d8aa5d; font-size: 12px; font-weight: bold; text-transform: uppercase;">Servicio</td>
                  <td style="color: #ffffff; font-size: 14px; font-weight: bold;">${service}</td>
                </tr>
                <tr>
                  <td style="color: #d8aa5d; font-size: 12px; font-weight: bold; text-transform: uppercase; vertical-align: top;">Mensaje</td>
                  <td style="color: #c4bfa5; font-size: 14px; line-height: 1.5;">"${data.message}"</td>
                </tr>
              </table>
              <div style="margin-top: 25px; text-align: center;">
                <a href="https://wa.me/${whatsappPhone}?text=Hola%20${encodeURIComponent(data.name)},%20gracias%20por%20escribir%20a%20mi%20web%20sobre%20${encodeURIComponent(service)}." style="display: inline-block; background-color: #d8aa5d; color: #000000; padding: 12px 24px; border-radius: 20px; font-weight: bold; text-decoration: none; font-size: 13px; text-transform: uppercase;">Responder por WhatsApp</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  // Envío a Cliente
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Sebastián Barrera <onboarding@resend.dev>',
        to: [data.email],
        subject: `Confirmación de Solicitud de Proyecto - Sebastián Barrera`,
        html: clientHtml,
      }),
    })
    if (!res.ok) {
      console.error('[sendEmailNotifications] Error enviando al cliente:', res.statusText)
    }
  } catch (err) {
    console.error('[sendEmailNotifications] Falló envío al cliente:', err)
  }

  // Envío a Propietario (Sebastián)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Notificaciones Web <onboarding@resend.dev>',
        to: [ownerEmail],
        subject: `🔔 Nueva Solicitud: ${data.name} - ${service}`,
        html: ownerHtml,
      }),
    })
    if (!res.ok) {
      console.error('[sendEmailNotifications] Error enviando al propietario:', res.statusText)
    }
  } catch (err) {
    console.error('[sendEmailNotifications] Falló envío al propietario:', err)
  }
}

/* ── Submit Contact Main server action ──────────────────────── */
export async function submitContact(formData: unknown) {
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const data = parsed.data

  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? '0.0.0.0'
  const ipHash = hashIp(ip)

  const supabaseAdmin = createAdminClient()
  const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW * 60 * 1000).toISOString()

  const { count } = await supabaseAdmin
    .from('rate_limit_log')
    .select('*', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', windowStart)

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return {
      success: false,
      error: `Has enviado demasiadas solicitudes. Espera ${RATE_LIMIT_WINDOW} minutos e intenta de nuevo.`
    }
  }

  await supabaseAdmin.from('rate_limit_log').insert({ ip_hash: ipHash })

  const clean = {
    name:             sanitize(data.name),
    email:            sanitize(data.email),
    company:          data.company ? sanitize(data.company) : null,
    service_interest: data.service_interest || null,
    message:          sanitize(data.message),
    ip_hash:          ipHash,
  }

  const { error } = await supabaseAdmin
    .from('contact_requests')
    .insert(clean)

  if (error) {
    console.error('[submitContact] Error Supabase:', error)
    return { success: false, error: 'Error al enviar. Intenta de nuevo.' }
  }

  // Ejecutamos las integraciones externas asincrónicamente para no bloquear el retorno al cliente
  // y evitar que un fallo en correos/sheets arruine el registro
  postToGoogleSheets(clean).catch(err => console.error('[submitContact] Error asíncrono Google Sheets:', err))
  sendEmailNotifications(clean).catch(err => console.error('[submitContact] Error asíncrono Correo (Resend):', err))

  return { success: true }
}
