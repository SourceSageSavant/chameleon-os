import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ProductInput {
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
}

interface GeneratedBrand {
    storeName: string;
    storeSlug: string;
    tagline: string;
    theme: 'organic' | 'minimalist' | 'cyber' | 'bold' | 'luxury';
    primaryColor: string;
    accentColor: string;
    trustBadges: string[];
    productTitle: string;
    productDescription: string;
    aboutContent: string;
    faqItems: Array<{ question: string; answer: string }>;
}

// Theme presets with color palettes
const themePresets = {
    organic: { primary: '#2D5A27', accent: '#8BC34A', bg: '#FDFBF7' },
    minimalist: { primary: '#1e1e1e', accent: '#666666', bg: '#FFFFFF' },
    cyber: { primary: '#0A0A0A', accent: '#00FF88', bg: '#0A0A0A' },
    bold: { primary: '#FF4500', accent: '#FFD700', bg: '#1A1A1A' },
    luxury: { primary: '#1A1A1A', accent: '#C5A572', bg: '#F5F5F5' },
};

export async function POST(request: NextRequest) {
    try {
        const { product }: { product: ProductInput } = await request.json();

        if (!product || !product.title) {
            return NextResponse.json({ error: 'Product data required' }, { status: 400 });
        }

        const category = product.category || 'general';

        // Use Gemini AI for real content generation
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are an expert e-commerce brand strategist and conversion copywriter. Generate a complete brand identity for a dropshipping store selling this product:

PRODUCT INFO:
- Title: ${product.title}
- Description: ${product.description || 'No description provided'}
- Price: $${product.price || 29.99}
- Category: ${category}

Generate the following in JSON format (respond ONLY with valid JSON, no markdown):
{
  "storeName": "A unique, memorable 1-2 word brand name (not generic, should feel premium)",
  "tagline": "A compelling 3-6 word tagline that creates desire",
  "theme": "One of: organic, minimalist, cyber, bold, luxury (pick based on product category)",
  "productTitle": "An optimized, benefit-focused product title (max 60 chars)",
  "productDescription": "A 3-paragraph product description with benefits, features, and a call-to-action. Use bullet points for features. Make it convert.",
  "aboutContent": "A 2-paragraph about page that builds trust and tells the brand story",
  "trustBadges": ["4 relevant trust badges for this product category"],
  "faqItems": [
    {"question": "Common question 1", "answer": "Helpful answer"},
    {"question": "Common question 2", "answer": "Helpful answer"},
    {"question": "Common question 3", "answer": "Helpful answer"}
  ]
}

IMPORTANT:
- Make the content UNIQUE and specific to this product
- Use persuasive, conversion-focused language
- The store name should be catchy and domain-name friendly
- Trust badges should be realistic and category-appropriate`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse the JSON response
        let aiGenerated;
        try {
            // Clean up the response - remove any markdown code blocks
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            aiGenerated = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);
            // Fallback to basic generation if AI parsing fails
            return NextResponse.json({
                success: false,
                error: 'AI response parsing failed',
                fallback: true,
            }, { status: 500 });
        }

        // Get theme colors
        const themeName = aiGenerated.theme as keyof typeof themePresets;
        const themeColors = themePresets[themeName] || themePresets.minimalist;

        // Build the final brand object
        const storeSlug = aiGenerated.storeName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        const generatedBrand: GeneratedBrand = {
            storeName: aiGenerated.storeName,
            storeSlug,
            tagline: aiGenerated.tagline,
            theme: themeName,
            primaryColor: themeColors.primary,
            accentColor: themeColors.accent,
            trustBadges: aiGenerated.trustBadges || ['Free Shipping', 'Secure Checkout', '30-Day Returns', '24/7 Support'],
            productTitle: aiGenerated.productTitle,
            productDescription: aiGenerated.productDescription,
            aboutContent: aiGenerated.aboutContent,
            faqItems: aiGenerated.faqItems || [],
        };

        return NextResponse.json({
            success: true,
            brand: generatedBrand,
            category,
            aiGenerated: true,
        });

    } catch (error) {
        console.error('Brand generation error:', error);

        // Check if it's an API key error
        if (String(error).includes('API_KEY')) {
            return NextResponse.json(
                { error: 'Gemini API key not configured. Set GEMINI_API_KEY in .env.local' },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to generate brand' },
            { status: 500 }
        );
    }
}

