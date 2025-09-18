/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0?dts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OrderConfirmationRequest {
  order: {
    order_number: string;
    customer_first_name: string;
    customer_last_name: string;
    customer_email: string;
    total: number;
    shipping_cost: number;
    subtotal: number;
    shipping_address: string;
    shipping_city: string;
    shipping_postal_code: string;
    shipping_country: string;
    payment_method: string;
    created_at: string;
    promo_code_used?: string;
    discount_amount?: number;
  };
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
    total: number;
    selected_color?: string;
    selected_size?: string;
  }>;
  promo_info?: {
    code: string;
    discount_amount: number;
    original_subtotal: number;
  } | null;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order, items, promo_info }: OrderConfirmationRequest = await req.json();

    const itemsHtml = items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 12px 0;">${item.product_name}</td>
        <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: center;">${item.price.toFixed(2)}€</td>
        <td style="padding: 12px 0; text-align: right; font-weight: bold;">${item.total.toFixed(2)}€</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmation de commande - Karnaval</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Karnaval</h1>
            <p style="color: #666; margin: 5px 0;">Votre boutique de sneakers</p>
          </div>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 15px 0; color: #1e293b;">Merci pour votre commande !</h2>
            <p style="margin: 0;">Bonjour ${order.customer_first_name} ${order.customer_last_name},</p>
            <p>Nous avons bien reçu votre commande n°<strong>${order.order_number}</strong> passée le ${new Date(order.created_at).toLocaleDateString('fr-FR')}.</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f1f5f9;">
                  <th style="padding: 12px 0; text-align: left;">Produit</th>
                  <th style="padding: 12px 0; text-align: center;">Qté</th>
                  <th style="padding: 12px 0; text-align: center;">Prix unitaire</th>
                  <th style="padding: 12px 0; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
              ${promo_info ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #059669;">
                <span>Réduction (${promo_info.code}):</span>
                <span>-${promo_info.discount_amount.toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Sous-total:</span>
                <span>${order.subtotal.toFixed(2)}€</span>
              </div>
              ` : `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Sous-total:</span>
                <span>${order.subtotal.toFixed(2)}€</span>
              </div>
              `}
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Frais de livraison:</span>
                <span>${order.shipping_cost.toFixed(2)}€</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; color: #2563eb;">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}€</span>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="border-bottom: 2px solid #2563eb; padding-bottom: 10px;">Adresse de livraison</h3>
            <p style="margin: 10px 0;">
              ${order.customer_first_name} ${order.customer_last_name}<br>
              ${order.shipping_address}<br>
              ${order.shipping_postal_code} ${order.shipping_city}<br>
              ${order.shipping_country}
            </p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; color: #92400e;">Que se passe-t-il maintenant ?</h3>
            <p style="margin: 0;">Votre commande est en cours de traitement. Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre commande sera expédiée.</p>
          </div>

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 12px; color: #666;">
            <h4>Mentions légales</h4>
            <p><strong>Karnaval SARL</strong><br>
            123 Rue de la Mode, 75001 Paris<br>
            SIRET: 123 456 789 00012<br>
            TVA: FR12345678901</p>
            
            <p><strong>Conditions de vente:</strong> Conformément à la loi, vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation.</p>
            
            <p><strong>Service client:</strong> contact@karnaval.fr | 01 23 45 67 89</p>
            
            <p style="margin-top: 20px;">Cet email a été envoyé à ${order.customer_email}. Si vous avez des questions, n'hésitez pas à nous contacter.</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Karnaval <onboarding@resend.dev>",
      to: [order.customer_email],
      subject: `Confirmation de commande ${order.order_number}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: (typeof error === 'object' && error && 'message' in error) ? (error as { message?: string }).message : 'Unknown error' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);