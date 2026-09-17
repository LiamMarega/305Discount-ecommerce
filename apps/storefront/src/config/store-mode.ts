export type StoreMode = 'catalog' | 'ecommerce';

export type EcommerceFeature =
    | 'cart'
    | 'checkout'
    | 'auth'
    | 'account'
    | 'orders'
    | 'payments'
    | 'paywalls'
    | 'roles';

const rawStoreMode = process.env.NEXT_PUBLIC_STORE_MODE;

export const STORE_MODE: StoreMode = rawStoreMode === 'ecommerce' ? 'ecommerce' : 'catalog';

export const storeFeatures = {
    mode: STORE_MODE,
    isCatalog: STORE_MODE === 'catalog',
    isEcommerce: STORE_MODE === 'ecommerce',
    products: true,
    productDetail: true,
    collections: true,
    search: true,
    prices: true,
    whatsappInquiry: true,
    cart: STORE_MODE === 'ecommerce',
    checkout: STORE_MODE === 'ecommerce',
    auth: STORE_MODE === 'ecommerce',
    account: STORE_MODE === 'ecommerce',
    orders: STORE_MODE === 'ecommerce',
    payments: STORE_MODE === 'ecommerce',
    paywalls: STORE_MODE === 'ecommerce',
    roles: STORE_MODE === 'ecommerce',
} as const;

export function isCatalogMode() {
    return STORE_MODE === 'catalog';
}

export function isEcommerceMode() {
    return STORE_MODE === 'ecommerce';
}

export function requireEcommerceFeature(feature: EcommerceFeature = 'checkout') {
    if (!storeFeatures[feature]) {
        throw new Error(`Ecommerce feature "${feature}" is disabled in ${STORE_MODE} mode`);
    }
}
