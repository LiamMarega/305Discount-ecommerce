import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSchedulerPlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import {defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader} from '@vendure/email-plugin';
import {AssetServerPlugin} from '@vendure/asset-server-plugin';
import {DashboardPlugin} from '@vendure/dashboard/plugin';
import {GraphiqlPlugin} from '@vendure/graphiql-plugin';
import 'dotenv/config';
import path from 'path';
import {getServerStoreMode} from './config/store-mode';
import {EhaDashboardPlugin} from './plugins/eha-dashboard/eha-dashboard.plugin';

const IS_DEV = process.env.APP_ENV === 'dev' || process.env.NODE_ENV !== 'production';
const serverPort = Number(process.env.PORT || 3000);
const storefrontUrl = process.env.STOREFRONT_URL || 'http://localhost:3001';
const publicUrl = getPublicUrl();
const adminApiPath = 'admin-api';
const shopApiPath = 'shop-api';

function catalogShopApiGuard(
    req: {body?: {query?: unknown}},
    res: {status: (statusCode: number) => {json: (body: unknown) => void}},
    next: () => void
) {
    if (getServerStoreMode() === 'catalog' && typeof req.body?.query === 'string' && /\\bmutation\\b/i.test(req.body.query)) {
        res.status(403).json({
            errors: [{message: 'Ecommerce mutations are disabled while STORE_MODE=catalog'}],
        });
        return;
    }

    next();
}

function requireEnv(name: string, fallback?: string): string {
    const value = process.env[name] || fallback;
    if (!value) {
        throw new Error(`${name} environment variable is required`);
    }
    return value;
}

function getPublicUrl(): string {
    if (process.env.PUBLIC_URL) {
        return process.env.PUBLIC_URL.replace(/\/$/, '');
    }

    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
        return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
    }

    return `http://localhost:${serverPort}`;
}


function getEmailTransport() {
    if (process.env.SMTP_HOST) {
        return {
            type: 'smtp' as const,
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USERNAME && process.env.SMTP_PASSWORD
                ? {
                    user: process.env.SMTP_USERNAME,
                    pass: process.env.SMTP_PASSWORD,
                }
                : undefined,
        };
    }

    return {type: 'none' as const};
}

const emailBaseOptions = {
    handlers: defaultEmailHandlers,
    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
    globalTemplateVars: {
        fromAddress: process.env.EMAIL_FROM_ADDRESS || '"easy-home-appliance" <noreply@example.com>',
        verifyEmailAddressUrl: `${storefrontUrl}/verify`,
        passwordResetUrl: `${storefrontUrl}/password-reset`,
        changeEmailAddressUrl: `${storefrontUrl}/verify-email-address-change`,
    },
};

function getDbConnectionOptions(): VendureConfig['dbConnectionOptions'] {
    if (process.env.DATABASE_URL) {
        return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            synchronize: false,
            migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
            logging: false,
            ...(process.env.DB_SSL === 'false'
                ? {}
                : {ssl: {rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'}}),
        };
    }

    return {
        type: 'better-sqlite3',
        synchronize: false,
        migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
        logging: false,
        database: process.env.SQLITE_DB_PATH || path.join(__dirname, '../vendure.sqlite'),
    };
}

export const config: VendureConfig = {
    apiOptions: {
        port: serverPort,
        adminApiPath,
        shopApiPath,
        trustProxy: IS_DEV ? false : 1,
        middleware: [
            {
                handler: catalogShopApiGuard,
                route: shopApiPath,
            },
        ],
        cors: {
            origin: IS_DEV ? true : [storefrontUrl],
            credentials: true,
        },
        ...(IS_DEV ? {
            adminApiDebug: true,
            shopApiDebug: true,
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: requireEnv('SUPERADMIN_USERNAME', IS_DEV ? 'superadmin' : undefined),
            password: requireEnv('SUPERADMIN_PASSWORD', IS_DEV ? 'superadmin' : undefined),
        },
        cookieOptions: {
            secret: requireEnv('COOKIE_SECRET', IS_DEV ? 'dev-cookie-secret-change-me' : undefined),
            sameSite: IS_DEV ? 'lax' : 'none',
            secure: !IS_DEV,
        },
    },
    dbConnectionOptions: getDbConnectionOptions(),
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },
    customFields: {},
    plugins: [
        ...(IS_DEV ? [GraphiqlPlugin.init()] : []),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: process.env.ASSET_UPLOAD_DIR
                || path.join(__dirname, '../static/assets'),
            assetUrlPrefix: IS_DEV
                ? undefined
                : (process.env.ASSET_URL_PREFIX || `${publicUrl}/assets/`),
        }),
        DefaultSchedulerPlugin.init(),
        DefaultJobQueuePlugin.init({useDatabaseForBuffer: true}),
        DefaultSearchPlugin.init({bufferUpdates: false, indexStockStatus: true}),
        EhaDashboardPlugin,
        EmailPlugin.init(IS_DEV
            ? {
                ...emailBaseOptions,
                devMode: true,
                outputPath: path.join(__dirname, '../static/email/test-emails'),
                route: 'mailbox',
            }
            : {
                ...emailBaseOptions,
                transport: getEmailTransport(),
            }),
        DashboardPlugin.init({
            route: 'dashboard',
            appDir: IS_DEV
                ? path.join(__dirname, '../dist/dashboard')
                : path.join(__dirname, 'dashboard'),
        }),
    ],
};
