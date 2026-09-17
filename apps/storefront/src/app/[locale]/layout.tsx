import type {Metadata, Viewport} from "next";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {Plus_Jakarta_Sans, Geist_Mono} from "next/font/google";
import {getMessages, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {toOgLocale} from "@/i18n/locale-utils";
import {getRouteLocale} from "@/i18n/server";
import {Toaster} from "@/components/ui/sonner";
import {Navbar} from "@/components/layout/navbar";
import {Footer} from "@/components/layout/footer";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {SITE_NAME, SITE_URL, buildCanonicalUrl} from "@/lib/metadata";
import {BRAND} from "@/lib/brand";
import "./globals.css";
import {connection} from "next/server";
import {Analytics} from "@vercel/analytics/next";

const jakarta = Plus_Jakarta_Sans({
    variable: "--font-sans",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
});

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({locale}));
}

function siteDescription(locale: string) {
    return locale.startsWith('es')
        ? 'Compra muebles, electrodomésticos y colchones en 305 Discount en Miami, FL. Consulta inventario, precios y disponibilidad con nuestro equipo.'
        : 'Shop furniture, appliances and mattresses at 305 Discount in Miami, FL. Browse current inventory and contact our team for pricing and availability.';
}

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const ogLocale = toOgLocale(locale);
    const description = siteDescription(locale);

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: SITE_NAME,
            template: `%s | ${SITE_NAME}`,
        },
        description,
        applicationName: BRAND.name,
        category: 'shopping',
        icons: {
            icon: [{url: '/brand/logo_single_bg.svg', type: 'image/svg+xml'}],
            shortcut: '/brand/logo_single_bg.svg',
            apple: '/brand/logo_single_bg.svg',
        },
        openGraph: {
            type: "website",
            siteName: SITE_NAME,
            title: SITE_NAME,
            description,
            locale: ogLocale,
            url: buildCanonicalUrl(`/${locale}`),
            images: [{url: '/brand/logo.webp', alt: `${BRAND.name} logo`}],
        },
        twitter: {
            card: "summary_large_image",
            title: SITE_NAME,
            description,
            images: ['/brand/logo.webp'],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        alternates: {
            languages: Object.fromEntries(
                routing.locales.map((l) => [l, `/${l}`])
            ),
        },
    };
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#011c50"},
    ],
};

export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
    const {locale} = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    await connection();

    setRequestLocale(locale);
    const messages = await getMessages({locale});

    return (
        <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
            <body
                className={`${jakarta.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider>
                        <Navbar />
                        {children}
                        <Footer/>
                        <Toaster/>
                        <Analytics/>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
