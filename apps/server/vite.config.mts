import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { createLogger, defineConfig } from 'vite';

function discount305DashboardBranding() {
    return {
        name: '305discount-dashboard-branding',
        enforce: 'post' as const,
        transformIndexHtml(html: string) {
            return html
                .replace(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/svg+xml" href="brand/logo_single_bg.svg" />')
                .replace('Vendure Admin Dashboard', '305 Discount Dashboard')
                .replace('content="Vendure"', 'content="305 Discount"');
        },
    };
}

function stripBrokenDependencySourcemaps() {
    return {
        name: 'strip-broken-dependency-sourcemaps',
        enforce: 'pre' as const,
        transform(code: string, id: string) {
            if (id.includes('@0no-co/graphql.web/dist/graphql.web.mjs')) {
                return {
                    code: code.replace(/\n?\/\/# sourceMappingURL=.*$/m, ''),
                    map: null,
                };
            }
            return null;
        },
    };
}

const viteLogger = createLogger();
const shouldSuppressViteMessage = (message: string) =>
    message.includes('Sourcemap for') && message.includes('@0no-co/graphql.web');
const viteWarn = viteLogger.warn.bind(viteLogger);
const viteWarnOnce = viteLogger.warnOnce.bind(viteLogger);
viteLogger.warn = (message, options) => {
    if (shouldSuppressViteMessage(message)) {
        return;
    }
    viteWarn(message, options);
};
viteLogger.warnOnce = (message, options) => {
    if (shouldSuppressViteMessage(message)) {
        return;
    }
    viteWarnOnce(message, options);
};

export default defineConfig({
    customLogger: viteLogger,
    base: '/dashboard',
    publicDir: join(__dirname, 'src/plugins/eha-dashboard/dashboard/public'),
    build: {
        outDir: join(__dirname, 'dist/dashboard'),
    },
    plugins: [
        stripBrokenDependencySourcemaps(),
        discount305DashboardBranding(),
        vendureDashboardPlugin({
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            api: process.env.NODE_ENV === 'production'
                ? { host: 'auto', port: 'auto' }
                : { host: 'http://localhost', port: 3000 },
            gqlOutputPath: './src/gql',
        }),
    ],
    resolve: {
        alias: {
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
