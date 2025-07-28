import { getUserSession } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "./useLogout";

export function useUserSession() {
    const { logout } = useLogout();
    const queryKey = ["user-session"];
    const { data: userSession, isLoading, isError, ...others } = useQuery({
        queryKey,
        queryFn: () => getUserSession(),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    if (!isLoading) {
        if (!userSession) {
            logout();
        }
    }

    if (isError) {
        logout();
    }


    return { userSession, isLoading, isError, ...others, queryKey };
}