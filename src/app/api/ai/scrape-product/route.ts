import { NextRequest, NextResponse } from 'next/server';

interface ScrapedProduct {
    title: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    source: string;
}

// Simple HTML parser - extracts common e-commerce product patterns
function extractFromHTML(html: string, url: string): Partial<ScrapedProduct> {
    const result: Partial<ScrapedProduct> = { source: new URL(url).hostname };

    // Extract title from common patterns
    const titlePatterns = [
        /<meta property="og:title" content="([^"]+)"/i,
        /<title>([^<]+)<\/title>/i,
        /<h1[^>]*>([^<]+)<\/h1>/i,
        /<meta name="title" content="([^"]+)"/i,
    ];
    for (const pattern of titlePatterns) {
        const match = html.match(pattern);
        if (match) {
            result.title = match[1].trim().replace(/\s+/g, ' ');
            break;
        }
    }

    // Extract description
    const descPatterns = [
        /<meta property="og:description" content="([^"]+)"/i,
        /<meta name="description" content="([^"]+)"/i,
    ];
    for (const pattern of descPatterns) {
        const match = html.match(pattern);
        if (match) {
            result.description = match[1].trim();
            break;
        }
    }

    // Extract images
    const imagePatterns = [
        /<meta property="og:image" content="([^"]+)"/gi,
        /<img[^>]+src="(https?:\/\/[^"]+)"/gi,
    ];
    const images: string[] = [];
    for (const pattern of imagePatterns) {
        let match;
        while ((match = pattern.exec(html)) !== null && images.length < 5) {
            const img = match[1];
            // Filter out tiny icons and tracking pixels
            if (!img.includes('pixel') && !img.includes('tracking') && !img.includes('icon')) {
                images.push(img);
            }
        }
    }
    result.images = [...new Set(images)].slice(0, 5);

    // Extract price patterns
    const pricePatterns = [
        /\$(\d+(?:\.\d{2})?)/,
        /"price":\s*"?(\d+(?:\.\d{2})?)"/i,
        /price[^0-9]*(\d+(?:\.\d{2})?)/i,
    ];
    for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match) {
            result.price = parseFloat(match[1]);
            break;
        }
    }

    // Determine category from keywords
    const text = (result.title || '') + ' ' + (result.description || '');
    const textLower = text.toLowerCase();

    if (textLower.includes('supplement') || textLower.includes('vitamin') || textLower.includes('protein') || textLower.includes('creatine')) {
        result.category = 'health';
    } else if (textLower.includes('tech') || textLower.includes('electronic') || textLower.includes('gaming') || textLower.includes('phone')) {
        result.category = 'tech';
    } else if (textLower.includes('fashion') || textLower.includes('clothing') || textLower.includes('dress') || textLower.includes('shoe')) {
        result.category = 'fashion';
    } else if (textLower.includes('beauty') || textLower.includes('skin') || textLower.includes('cosmetic')) {
        result.category = 'beauty';
    } else if (textLower.includes('home') || textLower.includes('kitchen') || textLower.includes('decor')) {
        result.category = 'home';
    } else {
        result.category = 'general';
    }

    return result;
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
            },
        });

        if (!response.ok) {
            return NextResponse.json({
                error: `Failed to fetch URL: ${response.status}`
            }, { status: 400 });
        }

        const html = await response.text();
        const scraped = extractFromHTML(html, url);

        // Ensure we have at least basic data
        if (!scraped.title) {
            scraped.title = 'Untitled Product';
        }
        if (!scraped.price) {
            scraped.price = 29.99; // Default price
        }
        if (!scraped.description) {
            scraped.description = 'Premium quality product';
        }

        return NextResponse.json({
            success: true,
            product: scraped,
        });

    } catch (error) {
        console.error('Scrape error:', error);
        return NextResponse.json(
            { error: 'Failed to scrape URL' },
            { status: 500 }
        );
    }
}
