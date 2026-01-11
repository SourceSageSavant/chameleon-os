// Theme definitions for ChameleonCommerceOS
// Expanded from 3 to 10 themes for maximum variety

export interface ThemeConfig {
    id: string;
    name: string;
    description: string;
    category: 'modern' | 'classic' | 'bold' | 'minimal';
    colors: {
        primary: string;
        accent: string;
        background: string;
        text: string;
        muted: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    buttonStyle: 'solid' | 'outline' | 'soft' | 'gradient';
    heroLayout: 'left' | 'center' | 'right' | 'split';
    preview: string; // Preview image or gradient
}

export const THEMES: ThemeConfig[] = [
    // === Original Themes ===
    {
        id: 'organic',
        name: 'Organic',
        description: 'Natural, wellness-focused with earthy tones',
        category: 'classic',
        colors: {
            primary: '#2D5A27',
            accent: '#8BC34A',
            background: '#FAFAF5',
            text: '#1a1a1a',
            muted: '#6b7280',
        },
        fonts: {
            heading: 'Georgia, serif',
            body: 'system-ui, sans-serif',
        },
        radius: 'lg',
        buttonStyle: 'solid',
        heroLayout: 'center',
        preview: 'linear-gradient(135deg, #2D5A27 0%, #8BC34A 100%)',
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean, high-end with elegant typography',
        category: 'minimal',
        colors: {
            primary: '#1e1e1e',
            accent: '#c5a572',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#9ca3af',
        },
        fonts: {
            heading: 'Playfair Display, serif',
            body: 'Inter, sans-serif',
        },
        radius: 'none',
        buttonStyle: 'outline',
        heroLayout: 'left',
        preview: 'linear-gradient(135deg, #1e1e1e 0%, #3a3a3a 100%)',
    },
    {
        id: 'cyber',
        name: 'Cyber',
        description: 'Dark mode with neon accents for tech products',
        category: 'bold',
        colors: {
            primary: '#1a1a2e',
            accent: '#00d4ff',
            background: '#0f0f1a',
            text: '#ffffff',
            muted: '#6b7280',
        },
        fonts: {
            heading: 'Orbitron, sans-serif',
            body: 'Roboto, sans-serif',
        },
        radius: 'md',
        buttonStyle: 'gradient',
        heroLayout: 'center',
        preview: 'linear-gradient(135deg, #1a1a2e 0%, #00d4ff 100%)',
    },

    // === New Themes ===
    {
        id: 'bold',
        name: 'Bold',
        description: 'High contrast, attention-grabbing design',
        category: 'bold',
        colors: {
            primary: '#ff3366',
            accent: '#ffcc00',
            background: '#ffffff',
            text: '#1a1a1a',
            muted: '#6b7280',
        },
        fonts: {
            heading: 'Bebas Neue, sans-serif',
            body: 'Open Sans, sans-serif',
        },
        radius: 'sm',
        buttonStyle: 'solid',
        heroLayout: 'split',
        preview: 'linear-gradient(135deg, #ff3366 0%, #ffcc00 100%)',
    },
    {
        id: 'retro',
        name: 'Retro',
        description: 'Vintage vibes with nostalgic color palette',
        category: 'classic',
        colors: {
            primary: '#e07b53',
            accent: '#f4d35e',
            background: '#faf3e3',
            text: '#2d2a32',
            muted: '#7a7677',
        },
        fonts: {
            heading: 'Lobster, cursive',
            body: 'Lato, sans-serif',
        },
        radius: 'lg',
        buttonStyle: 'soft',
        heroLayout: 'center',
        preview: 'linear-gradient(135deg, #e07b53 0%, #f4d35e 100%)',
    },
    {
        id: 'luxury',
        name: 'Luxury',
        description: 'Premium feel with gold accents and dark tones',
        category: 'classic',
        colors: {
            primary: '#1a1a1a',
            accent: '#d4af37',
            background: '#0d0d0d',
            text: '#f5f5f5',
            muted: '#888888',
        },
        fonts: {
            heading: 'Cormorant Garamond, serif',
            body: 'Montserrat, sans-serif',
        },
        radius: 'none',
        buttonStyle: 'outline',
        heroLayout: 'center',
        preview: 'linear-gradient(135deg, #1a1a1a 0%, #d4af37 100%)',
    },
    {
        id: 'playful',
        name: 'Playful',
        description: 'Fun and colorful for lifestyle products',
        category: 'modern',
        colors: {
            primary: '#6366f1',
            accent: '#f472b6',
            background: '#fefce8',
            text: '#1e1b4b',
            muted: '#6b7280',
        },
        fonts: {
            heading: 'Poppins, sans-serif',
            body: 'Nunito, sans-serif',
        },
        radius: 'full',
        buttonStyle: 'soft',
        heroLayout: 'right',
        preview: 'linear-gradient(135deg, #6366f1 0%, #f472b6 100%)',
    },
    {
        id: 'corporate',
        name: 'Corporate',
        description: 'Professional and trustworthy for B2B',
        category: 'minimal',
        colors: {
            primary: '#1e3a5f',
            accent: '#60a5fa',
            background: '#f8fafc',
            text: '#0f172a',
            muted: '#64748b',
        },
        fonts: {
            heading: 'Inter, sans-serif',
            body: 'Inter, sans-serif',
        },
        radius: 'sm',
        buttonStyle: 'solid',
        heroLayout: 'left',
        preview: 'linear-gradient(135deg, #1e3a5f 0%, #60a5fa 100%)',
    },
    {
        id: 'nature',
        name: 'Nature',
        description: 'Calming natural tones for eco-friendly brands',
        category: 'classic',
        colors: {
            primary: '#2f4f4f',
            accent: '#90b77d',
            background: '#f5f5f0',
            text: '#2d3436',
            muted: '#74877a',
        },
        fonts: {
            heading: 'Merriweather, serif',
            body: 'Source Sans Pro, sans-serif',
        },
        radius: 'md',
        buttonStyle: 'soft',
        heroLayout: 'center',
        preview: 'linear-gradient(135deg, #2f4f4f 0%, #90b77d 100%)',
    },
    {
        id: 'urban',
        name: 'Urban',
        description: 'Street-style edge for fashion and lifestyle',
        category: 'bold',
        colors: {
            primary: '#2d2d2d',
            accent: '#f97316',
            background: '#fafafa',
            text: '#171717',
            muted: '#525252',
        },
        fonts: {
            heading: 'Oswald, sans-serif',
            body: 'Roboto, sans-serif',
        },
        radius: 'none',
        buttonStyle: 'solid',
        heroLayout: 'split',
        preview: 'linear-gradient(135deg, #2d2d2d 0%, #f97316 100%)',
    },
];

export function getThemeById(id: string): ThemeConfig | undefined {
    return THEMES.find(t => t.id === id);
}

export function getThemesByCategory(category: ThemeConfig['category']): ThemeConfig[] {
    return THEMES.filter(t => t.category === category);
}

// Font options for customization
export const FONT_OPTIONS = {
    headings: [
        { name: 'Inter', value: 'Inter, sans-serif', category: 'modern' },
        { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'elegant' },
        { name: 'Poppins', value: 'Poppins, sans-serif', category: 'friendly' },
        { name: 'Bebas Neue', value: 'Bebas Neue, sans-serif', category: 'bold' },
        { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', category: 'luxury' },
        { name: 'Oswald', value: 'Oswald, sans-serif', category: 'urban' },
        { name: 'Merriweather', value: 'Merriweather, serif', category: 'classic' },
        { name: 'Lobster', value: 'Lobster, cursive', category: 'retro' },
        { name: 'Georgia', value: 'Georgia, serif', category: 'classic' },
        { name: 'Orbitron', value: 'Orbitron, sans-serif', category: 'tech' },
    ],
    body: [
        { name: 'Inter', value: 'Inter, sans-serif', category: 'modern' },
        { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'neutral' },
        { name: 'Roboto', value: 'Roboto, sans-serif', category: 'clean' },
        { name: 'Lato', value: 'Lato, sans-serif', category: 'friendly' },
        { name: 'Nunito', value: 'Nunito, sans-serif', category: 'soft' },
        { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'professional' },
        { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'geometric' },
        { name: 'System UI', value: 'system-ui, sans-serif', category: 'native' },
    ],
};

// Radius options
export const RADIUS_OPTIONS = [
    { name: 'Sharp', value: 'none', css: '0' },
    { name: 'Subtle', value: 'sm', css: '0.25rem' },
    { name: 'Rounded', value: 'md', css: '0.5rem' },
    { name: 'Soft', value: 'lg', css: '1rem' },
    { name: 'Pill', value: 'full', css: '9999px' },
];

// Button style options
export const BUTTON_STYLE_OPTIONS = [
    { name: 'Solid', value: 'solid', description: 'Filled background' },
    { name: 'Outline', value: 'outline', description: 'Border only' },
    { name: 'Soft', value: 'soft', description: 'Light background' },
    { name: 'Gradient', value: 'gradient', description: 'Color gradient' },
];

// Hero layout options
export const HERO_LAYOUT_OPTIONS = [
    { name: 'Left Aligned', value: 'left', description: 'Text on left' },
    { name: 'Centered', value: 'center', description: 'Text centered' },
    { name: 'Right Aligned', value: 'right', description: 'Text on right' },
    { name: 'Split', value: 'split', description: 'Text left, image right' },
];
