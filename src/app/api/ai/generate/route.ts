import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { prompt, tone = 'persuasive' } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // Simulate AI Processing Delay (makes it feel real)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // MOCK MODE: Return high-quality simulated response based on the prompt
        // TODO: Replace with actual OpenAI/Anthropic call using the system prompt

        const mockResponse = generateMockResponse(prompt, tone);

        return NextResponse.json({
            success: true,
            data: mockResponse
        });

    } catch (error) {
        console.error('AI Generate Error:', error);
        return NextResponse.json(
            { error: 'Failed to generate content' },
            { status: 500 }
        );
    }
}

function generateMockResponse(prompt: string, tone: string) {
    // A simple heuristic to make the mock data relevant to the input
    const isTech = prompt.toLowerCase().includes('phone') || prompt.toLowerCase().includes('cam') || prompt.toLowerCase().includes('tech');
    const isHealth = prompt.toLowerCase().includes('health') || prompt.toLowerCase().includes('supplement') || prompt.toLowerCase().includes('skin');

    let title = `Premium ${prompt}`;
    let hook = "Experience the difference.";

    if (tone === 'hype') {
        hook = "You NEED this in your life immediately!";
    } else if (tone === 'luxury') {
        hook = "Indulge in uncompromising quality.";
    }

    return {
        title: `${title} - ${tone === 'hype' ? 'Viral Edition' : 'Pro Series'}`,
        short_description: `Stop settling for less. The new ${prompt} is engineered to change the way you live, work, and play. ${hook}`,
        features: [
            "Aerospace-grade materials for maximum durability",
            "Next-gen ergonomic design tailored for you",
            "Instant integration with your daily workflow",
            "Backed by our 100% satisfaction guarantee"
        ],
        long_description: `
            <h2>Why ${title} is a Game Changer</h2>
            <p>Have you ever felt like existing solutions just don't cut it? You're not alone. That's why we spent 18 months engineering the perfect ${prompt}.</p>
            
            <h3>Unmatched Performance</h3>
            <p>Whether you're a professional or an enthusiast, performance matters. Our proprietary technology ensures you get results 2x faster than the competition.</p>

            <h3>Designed for Humans, Not Robots</h3>
            <p>Forget clunky interfaces and confusing manuals. This product is intuitive from the moment you unbox it. It just works.</p>
            
            <blockquote>"I didn't realize how much I needed this until I tried it. Now I can't go back." - Verified Buyer</blockquote>
            
            <h3>The ${tone === 'luxury' ? 'Chameleon Promise' : 'No-Brainer Offer'}</h3>
            <p>We are so confident you'll love it that we offer a 30-day money-back guarantee. No questions asked. Try it risk-free today.</p>
        `,
        seo_keywords: [`best ${prompt}`, `${prompt} reviews`, `affordable ${prompt}`, "premium gear"]
    };
}
