import { getDivisions } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";

interface IUseGetDivisionsProps {
    key?: string[]
}

export function useGetDivisions(props?: IUseGetDivisionsProps) {
    const { key } = props || {};
    const { data: divisions, ...others } = useQuery({
        queryKey: key ? [...key] : ["get-all-divisions"],
        queryFn: getDivisions,
    })
    return { divisions, ...others };
}
