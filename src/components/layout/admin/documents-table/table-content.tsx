import TableItem from "./table-item";

type Props = {
    children?: React.ReactNode;
}

export default function TableContent({ children }: Props) {
    return (
        <div className="grid grid-cols-[6fr_3.2fr_2fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-b-2xl border border-t-0 border-gray-200 text-sm overflow-hidden">
            {children}
        </div>
    )
}