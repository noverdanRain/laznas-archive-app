import { removeUserSession } from "@/lib/actions";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
    const router = useRouter();
    const { mutate: logout, ...mutation } = useMutation({
        mutationFn: () => removeUserSession(),
        onSuccess: () => {
            router.replace("/auth");
        },
    });

    return { logout, ...mutation };
}