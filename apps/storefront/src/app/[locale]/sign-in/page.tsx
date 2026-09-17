import type {Metadata} from 'next';
import {Suspense} from 'react';
import {getRouteLocale} from '@/i18n/server';
import {getTranslations} from 'next-intl/server';
import {LoginForm} from "./login-form";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {SITE_NAME} from "@/lib/metadata";
import {storeFeatures} from '@/config/store-mode';
import {notFound} from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Auth'});
    return {
        title: t('pageTitle'),
    };
}

function LoginFormSkeleton() {
    return (
        <Card>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-12"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16"/>
                    <Skeleton className="h-10 w-full"/>
                </div>
                <Skeleton className="h-10 w-full"/>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">

                <div className="flex flex-col items-center space-y-2">
                    <Skeleton className="h-4 w-40"/>
                </div>
            </CardFooter>
        </Card>
    );
}

async function SignInContent({searchParams}: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
    const resolvedParams = await searchParams;
    const redirectTo = resolvedParams?.redirectTo as string | undefined;

    return <LoginForm redirectTo={redirectTo}/>;
}

export default async function SignInPage({searchParams}: PageProps<'/[locale]/sign-in'>) {
    if (!storeFeatures.auth) {
        notFound();
    }

    const locale = await getRouteLocale();
    const t = await getTranslations({locale, namespace: 'Auth'});

    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            {/* Branded panel — desktop only */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 [background:linear-gradient(135deg,var(--brand-navy),#0d1f4d_55%,var(--brand-blue-deep))] rounded-br-[40px]">
                <div className="max-w-md space-y-6 text-white">
                    <img src="/brand/logo-light.svg" alt={SITE_NAME} width={192} height={48} className="h-11 w-auto" />
                    <p className="text-xl leading-relaxed text-white/80">{t('welcomeBack')}</p>
                    <div className="flex gap-8 pt-4">
                        {[
                            [t('featureFast'), t('featureCheckout')],
                            [t('featureSecure'), t('featurePayments')],
                            [t('featureEasy'), t('featureReturns')],
                        ].map(([n, l]) => (
                            <div key={n}>
                                <p className="text-3xl font-extrabold text-brand-gold-lite">{n}</p>
                                <p className="text-sm text-white/70">{l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form panel */}
            <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-12">
                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-center">
                        <p className="text-sm font-medium text-primary tracking-wider uppercase lg:hidden">{SITE_NAME}</p>
                        <h1 className="text-3xl font-bold">{t('signIn')}</h1>
                        <p className="text-muted-foreground">
                            {t('enterCredentials')}
                        </p>
                    </div>
                    <Suspense fallback={<LoginFormSkeleton/>}>
                        <SignInContent searchParams={searchParams}/>
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
