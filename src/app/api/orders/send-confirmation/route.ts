import { NextRequest, NextResponse } from 'next/server';

// Email template for order confirmation
function generateOrderEmailHTML(order: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    lineItems: Array<{ title: string; quantity: number; price: number }>;
    subtotal: number;
    shipping: number;
    discount?: number;
    total: number;
    storeName: string;
}): string {
    const itemsHTML = order.lineItems.map(item => `
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
    <title>Order Confirmation</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2D5A27; margin-bottom: 10px;">${order.storeName}</h1>
        <p style="color: #666; font-size: 14px;">Order Confirmation</p>
    </div>

    <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="margin-top: 0; color: #2D5A27;">Thank you for your order!</h2>
        <p>Hi ${order.customerName || 'there'},</p>
        <p>We've received your order and it's being processed. Here are your order details:</p>
        
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">Order Number</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; font-family: monospace;">${order.orderNumber}</p>
        </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <thead>
            <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; font-weight: 600;">Item</th>
                <th style="padding: 12px; text-align: center; font-weight: 600;">Qty</th>
                <th style="padding: 12px; text-align: right; font-weight: 600;">Price</th>
            </tr>
        </thead>
        <tbody>
            ${itemsHTML}
        </tbody>
    </table>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Subtotal</span>
            <span>$${order.subtotal.toFixed(2)}</span>
        </div>
        ${order.discount ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; color: #2D5A27;">
            <span>Discount</span>
            <span>-$${order.discount.toFixed(2)}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <span>Shipping</span>
            <span>${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 2px solid #ddd; font-weight: bold; font-size: 18px;">
            <span>Total</span>
            <span>$${order.total.toFixed(2)}</span>
        </div>
    </div>

    <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #eee;">
        <p>You'll receive another email when your order ships.</p>
        <p>Questions? Reply to this email or contact us.</p>
        <p style="margin-top: 20px;">&copy; ${new Date().getFullYear()} ${order.storeName}. All rights reserved.</p>
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
            lineItems,
            subtotal,
            shipping,
            discount,
            total,
            storeName
        } = await request.json();

        if (!customerEmail || !orderNumber) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resendApiKey = process.env.RESEND_API_KEY;

        // If no Resend API key, log and return success (email won't be sent)
        if (!resendApiKey) {
            console.log('RESEND_API_KEY not configured. Email would be sent to:', customerEmail);
            console.log('Order:', orderNumber);
            return NextResponse.json({
                success: true,
                message: 'Email skipped (no API key configured)',
                wouldSendTo: customerEmail
            });
        }

        const emailHTML = generateOrderEmailHTML({
            orderNumber,
            customerName: customerName || 'Valued Customer',
            customerEmail,
            lineItems: lineItems || [],
            subtotal: subtotal || 0,
            shipping: shipping || 0,
            discount,
            total: total || 0,
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
                from: `${storeName || 'Store'} <orders@resend.dev>`,
                to: customerEmail,
                subject: `Order Confirmation ${orderNumber}`,
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
        console.error('Email send error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
