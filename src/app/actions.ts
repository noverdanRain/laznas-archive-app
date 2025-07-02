'use server';

import { cookies } from "next/headers";

export const deleteSession = async () =>{
    const cookieStore = await cookies();
    if(cookieStore.has('token')){
        cookieStore.delete('token');
    }
} 