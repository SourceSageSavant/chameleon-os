import { PageLayout } from '@/components/ui';
import { getStoreConfig, generateMetadata } from '@/lib/store-config';

const store = getStoreConfig();

export const metadata = generateMetadata({
    title: 'Lab Results & Certifications',
    description: `Third-party lab test results proving the purity and quality of ${store.name} products.`,
    path: '/lab-results',
}, store);

export default function LabResultsPage() {
    const store = getStoreConfig();

    return (
        <PageLayout
            title="Lab Results"
            subtitle="Third-party verified purity and quality"
            breadcrumb={[
                { name: 'Home', url: '/' },
                { name: 'Lab Results', url: '/lab-results' },
            ]}
        >
            <div className="space-y-6 sm:space-y-8">
                {/* Intro */}
                <section
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl"
                    style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                        <div className="text-3xl sm:text-4xl">🔬</div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold mb-2">100% Transparent</h2>
                            <p className="opacity-90 text-sm sm:text-base">
                                Every batch is tested by an independent, accredited laboratory.
                                We publish the results because we have nothing to hide.
                            </p>
                        </div>
                    </div>
                </section>

                {/* What we test for */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        What We Test For
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-green-500">✓</span> Active Ingredients
                            </h3>
                            <p className="text-xs sm:text-sm opacity-70">Verified potency matches label claims</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-green-500">✓</span> Heavy Metals
                            </h3>
                            <p className="text-xs sm:text-sm opacity-70">Lead, mercury, arsenic, cadmium tested</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-green-500">✓</span> Microbial Testing
                            </h3>
                            <p className="text-xs sm:text-sm opacity-70">No harmful bacteria, yeast, or mold</p>
                        </div>
                        <div className="p-4 rounded-xl" style={{ background: 'var(--color-background)' }}>
                            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                                <span className="text-green-500">✓</span> Purity Analysis
                            </h3>
                            <p className="text-xs sm:text-sm opacity-70">No contaminants or adulterants</p>
                        </div>
                    </div>
                </section>

                {/* Certifications */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Our Certifications
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
                        <div
                            className="p-4 sm:p-5 rounded-xl text-center"
                            style={{ background: 'var(--color-background)' }}
                        >
                            <div className="text-2xl sm:text-3xl mb-2">🛡️</div>
                            <h3 className="font-bold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Third-Party Tested</h3>
                            <p className="text-xs opacity-70">Independent lab verification</p>
                        </div>
                        <div
                            className="p-4 sm:p-5 rounded-xl text-center"
                            style={{ background: 'var(--color-background)' }}
                        >
                            <div className="text-2xl sm:text-3xl mb-2">🏭</div>
                            <h3 className="font-bold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>GMP Certified</h3>
                            <p className="text-xs opacity-70">FDA-registered facility</p>
                        </div>
                        <div
                            className="p-4 sm:p-5 rounded-xl text-center"
                            style={{ background: 'var(--color-background)' }}
                        >
                            <div className="text-2xl sm:text-3xl mb-2">🇺🇸</div>
                            <h3 className="font-bold mb-1 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Made in USA</h3>
                            <p className="text-xs opacity-70">Quality controlled manufacturing</p>
                        </div>
                    </div>
                </section>

                {/* Latest batch placeholder */}
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                        Latest Batch Results
                    </h2>
                    <div
                        className="p-4 sm:p-5 rounded-xl"
                        style={{ background: 'var(--color-background)' }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>Current Batch</h3>
                                <p className="text-xs sm:text-sm opacity-70">Tested by independent lab</p>
                            </div>
                            <span
                                className="self-start sm:self-auto px-4 py-2 rounded-full text-xs sm:text-sm font-bold text-white"
                                style={{ background: 'var(--color-success, #22C55E)' }}
                            >
                                ✓ All Tests Passed
                            </span>
                        </div>
                        <div className="overflow-x-auto -mx-4 sm:mx-0 scrollbar-hide">
                            <table className="w-full min-w-[350px] text-xs sm:text-sm">
                                <thead>
                                    <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                                        <th className="text-left py-2 px-2 opacity-70">Test</th>
                                        <th className="text-left py-2 px-2 opacity-70">Specification</th>
                                        <th className="text-right py-2 px-2 opacity-70">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                        <td className="py-3 px-2">Active Ingredients</td>
                                        <td className="py-3 px-2 opacity-70">Matches Label</td>
                                        <td className="py-3 px-2 text-right text-green-500">✓ Pass</td>
                                    </tr>
                                    <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                        <td className="py-3 px-2">Heavy Metals</td>
                                        <td className="py-3 px-2 opacity-70">Below Limits</td>
                                        <td className="py-3 px-2 text-right text-green-500">✓ Pass</td>
                                    </tr>
                                    <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                                        <td className="py-3 px-2">Microbial</td>
                                        <td className="py-3 px-2 opacity-70">None Detected</td>
                                        <td className="py-3 px-2 text-right text-green-500">✓ Pass</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-2">Purity</td>
                                        <td className="py-3 px-2 opacity-70">No Contaminants</td>
                                        <td className="py-3 px-2 text-right text-green-500">✓ Pass</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* QR code */}
                <section className="text-center pt-6 border-t" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
                    <div className="text-3xl sm:text-4xl mb-3">📱</div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: 'var(--color-text)' }}>
                        Scan Your Product
                    </h3>
                    <p className="opacity-70 max-w-md mx-auto text-xs sm:text-sm">
                        Each product includes a QR code that links to the Certificate of Analysis for that specific batch.
                    </p>
                </section>
            </div>
        </PageLayout>
    );
}
