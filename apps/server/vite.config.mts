import { vendureDashboardPlugin } from '@vendure/dashboard/vite';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';
import { createLogger, defineConfig } from 'vite';



function easyHomeDashboardBranding() {
    return {
        name: 'easy-home-dashboard-branding',
        enforce: 'post' as const,
        transformIndexHtml(html: string) {
            return html
                .replace(/<link rel="icon"[^>]*>/, '<link rel="icon" type="image/svg+xml" href="brand/logo_single_bg.svg" />')
                .replace('Vendure Admin Dashboard', 'Easy Home Appliance Dashboard')
                .replace('content="Vendure"', 'content="Easy Home Appliance"');
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
        easyHomeDashboardBranding(),
        vendureDashboardPlugin({
            // The vendureDashboardPlugin will scan your configuration in order
            // to find any plugins which have dashboard extensions, as well as
            // to introspect the GraphQL schema based on any API extensions
            // and custom fields that are configured.
            vendureConfigPath: pathToFileURL('./src/vendure-config.ts'),
            // Points to the location of your Vendure server.
            // In production, 'auto' lets the dashboard derive the API URL from the
            // server that serves it. In development, we use explicit defaults so that
            // the Vite dev server can reach the Vendure backend.
            api: process.env.NODE_ENV === 'production'
                ? { host: 'auto', port: 'auto' }
                : { host: 'http://localhost', port: 3000 },
            // When you start the Vite server, your Admin API schema will
            // be introspected and the types will be generated in this location.
            // These types can be used in your dashboard extensions to provide
            // type safety when writing queries and mutations.
            gqlOutputPath: './src/gql',
        }),
    ],
    resolve: {
        alias: {
            // This allows all plugins to reference a shared set of
            // GraphQL types.
            '@/gql': resolve(__dirname, './src/gql/graphql.ts'),
        },
    },
});
