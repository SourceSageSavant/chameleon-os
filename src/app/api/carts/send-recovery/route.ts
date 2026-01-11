import { NextRequest, NextResponse } from 'next/server';

function generateRecoveryEmailHTML({
    items,
    total,
    recoveryUrl,
    storeName,
}: {
    items: Array<{ title: string; quantity: number; price: number }>;
    total: number;
    recoveryUrl: string;
    storeName: string;
}): string {
    const itemsHTML = items.map(item => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.title}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Order</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D5A27; margin-bottom: 10px;">${storeName}</h1>
    </div>

    <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
        <div style="font-size: 48px; margin-bottom: 15px;">🛒</div>
        <h2 style="margin: 0; font-size: 24px;">You Left Something Behind!</h2>
        <p style="margin: 10px 0 0; opacity: 0.9;">Your cart misses you</p>
    </div>

    <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <p>Hey there! We noticed you didn't complete your order. Your items are still waiting for you:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr style="background: #fff;">
                    <th style="padding: 12px; text-align: left;">Item</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHTML}
            </tbody>
        </table>

        <div style="text-align: right; font-size: 20px; font-weight: bold; padding-top: 15px; border-top: 2px solid #ddd;">
            Total: $${total.toFixed(2)}
        </div>

        <div style="text-align: center; margin-top: 25px;">
            <a href="${recoveryUrl}" style="display: inline-block; background: #2D5A27; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Complete My Order →
            </a>
        </div>
    </div>

    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
        <p style="margin: 0; color: #856404;">⏰ Your cart will expire soon!</p>
    </div>

    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee;">
        <p>Questions? Reply to this email or contact us.</p>
        <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} ${storeName}. All rights reserved.</p>
    </div>
</body>
</html>
    `;
}

export async function POST(request: NextRequest) {
    try {
        const { cartId, customerEmail, items, total } = await request.json();

        if (!customerEmail) {
            return NextResponse.json({ error: 'No email provided' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const recoveryUrl = `${baseUrl}/cart?recover=${cartId}`;

        if (!resendApiKey) {
            console.log('RESEND_API_KEY not configured. Recovery email would be sent to:', customerEmail);
            return NextResponse.json({
                success: true,
                message: 'Email skipped (no API key configured)',
                wouldSendTo: customerEmail
            });
        }

        const emailHTML = generateRecoveryEmailHTML({
            items: items || [],
            total: total || 0,
            recoveryUrl,
            storeName: 'Store',
        });

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`,
            },
            body: JSON.stringify({
                from: 'Store <cart@resend.dev>',
                to: customerEmail,
                subject: "You left something behind! 🛒",
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
        console.error('Recovery email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
