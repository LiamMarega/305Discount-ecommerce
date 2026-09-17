export type ServerStoreMode = 'catalog' | 'ecommerce';

const rawStoreMode = process.env.STORE_MODE || process.env.NEXT_PUBLIC_STORE_MODE;

export const SERVER_STORE_MODE: ServerStoreMode = rawStoreMode === 'ecommerce' ? 'ecommerce' : 'catalog';

export function getServerStoreMode(): ServerStoreMode {
    return SERVER_STORE_MODE;
}
