import { useGetDocuments } from "@/hooks/useGetDocuments";
import TableFooter from "./table-footer";

type GetDocProps = ReturnType<typeof useGetDocuments>;

type Props = {
    children?: React.ReactNode;
}

export default function TableContent({ children, getDocsData }: Props & { getDocsData: GetDocProps }) {
    return (
        <div className="flex w-full flex-col justify-between bg-white rounded-b-2xl border border-t-0 border-gray-200 text-sm overflow-hidden min-h-[calc(100vh-300px)]">
            <div
                className="grid grid-cols-[5fr_3fr_2fr_2.5fr_0.9fr_0.6fr] gap-x-4 w-full"
            >
                {children}
            </div>
            <TableFooter getDocsData={getDocsData} />
        </div>
    )
}