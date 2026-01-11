import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ScrapedProduct {
    title: string;
    description: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    source: string;
    confidence: 'high' | 'medium' | 'low';
}

// Try to extract JSON-LD structured data first (most reliable)
function extractJsonLd(html: string): Partial<ScrapedProduct> | null {
    const jsonLdPattern = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
    let match;

    while ((match = jsonLdPattern.exec(html)) !== null) {
        try {
            const data = JSON.parse(match[1]);

            // Handle @graph array
            const products = data['@graph']
                ? data['@graph'].filter((item: any) => item['@type'] === 'Product')
                : [data];

            for (const product of products) {
                if (product['@type'] === 'Product') {
                    const offer = product.offers?.[0] || product.offers || {};
                    return {
                        title: product.name,
                        description: product.description,
                        price: parseFloat(offer.price) || undefined,
                        images: Array.isArray(product.image) ? product.image : [product.image].filter(Boolean),
                        confidence: 'high',
                    };
                }
            }
        } catch {
            // Continue to next JSON-LD block
        }
    }
    return null;
}

// Fallback: Extract from Open Graph and HTML patterns
function extractFromHTML(html: string, url: string): Partial<ScrapedProduct> {
    const result: Partial<ScrapedProduct> = {
        source: new URL(url).hostname,
        confidence: 'medium',
    };

    // Extract title
    const titlePatterns = [
        /<meta property="og:title" content="([^"]+)"/i,
        /<meta name="twitter:title" content="([^"]+)"/i,
        /<h1[^>]*class="[^"]*product[^"]*"[^>]*>([^<]+)/i,
        /<title>([^<]+)<\/title>/i,
    ];
    for (const pattern of titlePatterns) {
        const match = html.match(pattern);
        if (match) {
            result.title = match[1].trim().replace(/\s+/g, ' ').replace(/ - .*$/, '');
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

    // Extract images (prioritize product images)
    const images: string[] = [];

    // OG image first
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/i);
    if (ogImage) images.push(ogImage[1]);

    // Product gallery images
    const imgPattern = /<img[^>]+src="(https?:\/\/[^"]+)"/gi;
    let imgMatch;
    while ((imgMatch = imgPattern.exec(html)) !== null && images.length < 8) {
        const img = imgMatch[1];
        // Filter out icons, logos, and tiny images
        if (
            !img.includes('icon') &&
            !img.includes('logo') &&
            !img.includes('pixel') &&
            !img.includes('avatar') &&
            !img.includes('flag') &&
            img.length < 500 // Avoid data URIs
        ) {
            images.push(img);
        }
    }
    result.images = [...new Set(images)].slice(0, 5);

    // Extract price
    const pricePatterns = [
        /"price":\s*"?(\d+\.?\d*)"/i,
        /\$(\d+\.?\d*)/,
        /price[^0-9]*(\d+\.?\d*)/i,
    ];
    for (const pattern of pricePatterns) {
        const match = html.match(pattern);
        if (match) {
            const price = parseFloat(match[1]);
            if (price > 0 && price < 10000) {
                result.price = price;
                break;
            }
        }
    }

    return result;
}

// Use Gemini AI to extract product info from HTML when patterns fail
async function extractWithAI(html: string, url: string): Promise<Partial<ScrapedProduct>> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Truncate HTML to avoid token limits
        const truncatedHtml = html.substring(0, 15000);

        const prompt = `Extract product information from this e-commerce HTML. Return ONLY valid JSON:
{
  "title": "product name",
  "description": "product description", 
  "price": 0.00,
  "category": "health|tech|fashion|beauty|home|general"
}

HTML:
${truncatedHtml}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const extracted = JSON.parse(cleanedText);

        return {
            ...extracted,
            source: new URL(url).hostname,
            confidence: 'low',
        };
    } catch {
        return { confidence: 'low' };
    }
}

// Determine category from content
function categorize(text: string): string {
    const lower = text.toLowerCase();

    const categories: Record<string, string[]> = {
        health: ['supplement', 'vitamin', 'protein', 'creatine', 'fitness', 'wellness', 'nutrition'],
        tech: ['electronic', 'gaming', 'phone', 'computer', 'gadget', 'smart', 'wireless'],
        fashion: ['clothing', 'dress', 'shoe', 'fashion', 'wear', 'apparel', 'style'],
        beauty: ['beauty', 'skin', 'cosmetic', 'makeup', 'serum', 'cream', 'hair'],
        home: ['home', 'kitchen', 'decor', 'furniture', 'garden', 'living'],
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(kw => lower.includes(kw))) {
            return category;
        }
    }
    return 'general';
}

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
        }

        // Fetch the page
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        if (!response.ok) {
            return NextResponse.json({
                error: `Failed to fetch URL: ${response.status}`,
                suggestion: 'Some sites block scraping. Try a different product URL.',
            }, { status: 400 });
        }

        const html = await response.text();

        // Try extraction methods in order of reliability
        let scraped: Partial<ScrapedProduct> = {};

        // 1. Try JSON-LD (most reliable)
        const jsonLdData = extractJsonLd(html);
        if (jsonLdData?.title) {
            scraped = { ...jsonLdData };
        }

        // 2. Fallback to HTML patterns
        if (!scraped.title) {
            scraped = extractFromHTML(html, url);
        }

        // 3. Use AI if still missing critical data
        if (!scraped.title || (!scraped.price && !scraped.description)) {
            const aiExtracted = await extractWithAI(html, url);
            scraped = {
                ...scraped,
                ...aiExtracted,
                confidence: 'low',
            };
        }

        // Ensure we have at least basic data
        scraped.title = scraped.title || 'Untitled Product';
        scraped.price = scraped.price || 29.99;
        scraped.description = scraped.description || 'Premium quality product';
        scraped.category = scraped.category || categorize(`${scraped.title} ${scraped.description}`);
        scraped.source = scraped.source || new URL(url).hostname;

        return NextResponse.json({
            success: true,
            product: scraped,
        });

    } catch (error) {
        console.error('Scrape error:', error);
        return NextResponse.json(
            { error: 'Failed to scrape URL. The site may be blocking requests.' },
            { status: 500 }
        );
    }
}

