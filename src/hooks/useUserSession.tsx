import { getUserSession, removeUserSession } from "@/lib/actions/user-session";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useUserSession() {
    const router = useRouter();
    const { data: userSession, isLoading, isError, ...others } = useQuery({
        queryKey: ["user-session"],
        queryFn: () => getUserSession(),
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    if (!isLoading) {
        if (!userSession) {
            removeUserSession().then(() => {
                router.replace("/auth");
            });
        }
    }

    if (isError) {
        removeUserSession().then(() => {
            router.replace("/auth");
        });
    }


    return { userSession, isLoading, isError, ...others };
}