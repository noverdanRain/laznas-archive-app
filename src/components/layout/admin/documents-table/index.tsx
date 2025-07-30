"use client";

import TableContent from "./table-content";
import TableFooter from "./table-footer";
import TableHeader from "./table-header";
import TableItem from "./table-item";

export default function StaffDocumentsTable() {
    return (
        <div>
            <div className="h-4 w-full sticky top-[150px] bg-white z-10 after:content-[''] after:absolute after:w-full after:h-8 after:bg-white" />
            <TableHeader />
            <TableContent>
                {
                    Array.from({ length: 12 }).map((_, index) => (
                        <TableItem key={index} />
                    ))
                }
                <TableFooter/>
            </TableContent>
        </div>
    )
}