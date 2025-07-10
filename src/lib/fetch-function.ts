import axios from "axios";

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

export async function fetchGet<T>(pathname: string, option?: FetchOptions) {
    const response = await axios.get(pathname, option);
    console.log("RESPONSE MADEFAKER: ", response);
    // if (!response.ok) {
    //     throw new Error("Failed to fetch staff data");
    // }
    // return response.json() as Promise<T>;
}

export async function fetchPost(){
    const response = await axios.get("/api/staffs");
    // console.log(response.);
}
