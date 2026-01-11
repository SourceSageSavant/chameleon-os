import { NextRequest, NextResponse } from 'next/server';

// Email template for shipping notification
function generateShippingEmailHTML({
    orderNumber,
    customerName,
    trackingNumber,
    trackingUrl,
    storeName,
}: {
    orderNumber: string;
    customerName: string;
    trackingNumber: string;
    trackingUrl?: string;
    storeName: string;
}): string {
    const trackButtonHTML = trackingUrl
        ? `<a href="${trackingUrl}" style="display: inline-block; background: #2D5A27; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 20px;">Track My Package</a>`
        : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Order Has Shipped!</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D5A27; margin-bottom: 10px;">${storeName}</h1>
    </div>

    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">📦</div>
        <h2 style="margin: 0; font-size: 24px;">Your Order Has Shipped!</h2>
        <p style="margin: 10px 0 0; opacity: 0.9;">Great news, ${customerName || 'there'}!</p>
    </div>

    <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <p>Your order <strong>${orderNumber}</strong> is on its way to you!</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 5px; font-size: 14px; color: #666;">Tracking Number</p>
            <p style="margin: 0; font-size: 20px; font-weight: bold; font-family: monospace; word-break: break-all;">${trackingNumber}</p>
        </div>

        <div style="text-align: center;">
            ${trackButtonHTML}
        </div>
    </div>

    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="margin-top: 0; color: #166534;">📍 What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #166534;">
            <li>Your package is with the carrier</li>
            <li>Use the tracking number above to follow its journey</li>
            <li>Delivery typically takes 3-7 business days</li>
        </ul>
    </div>

    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee;">
        <p>Questions about your shipment? Reply to this email or contact us.</p>
        <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
    </div>
</body>
</html>
    `;
}

export async function POST(request: NextRequest) {
    try {
        const {
            orderNumber,
            customerEmail,
            customerName,
            trackingNumber,
            trackingUrl,
            storeName
        } = await request.json();

        if (!customerEmail || !orderNumber || !trackingNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;

        // If no Resend API key, log and return success
        if (!resendApiKey) {
            console.log('RESEND_API_KEY not configured. Shipping email would be sent to:', customerEmail);
            console.log('Tracking:', trackingNumber);
            return NextResponse.json({
                success: true,
                message: 'Email skipped (no API key configured)',
                wouldSendTo: customerEmail
            });
        }

        const emailHTML = generateShippingEmailHTML({
            orderNumber,
            customerName: customerName || 'Valued Customer',
            trackingNumber,
            trackingUrl,
            storeName: storeName || 'Store',
        });

        // Send email via Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: `${storeName || 'Store'} <shipping@resend.dev>`,
                to: customerEmail,
                subject: `Your Order ${orderNumber} Has Shipped! 📦`,
                html: emailHTML,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Resend error:', result);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, emailId: result.id });

    } catch (error) {
        console.error('Shipping email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
