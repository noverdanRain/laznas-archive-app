interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    mode?: RequestMode;
    redirect?: RequestRedirect;
    referrer?: string;
    referrerPolicy?: ReferrerPolicy;
    signal?: AbortSignal;
}

export async function fetchGet<T>(pathname: string, option?: FetchOptions): Promise<T> {
    const response = await fetch(pathname, option);
    if (!response.ok) {
        throw new Error("Failed to fetch staff data");
    }
    return response.json() as Promise<T>;
}
