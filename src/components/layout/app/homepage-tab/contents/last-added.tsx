'use client';

import { CalendarRange, ChartNoAxesGantt, Ellipsis, Eye, Folder, Search } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { TooltipText } from "@/components/common/tooltip-text";
import Link from "next/link";
import DocumentIcon, { type FileType } from "@/components/common/document-Icon";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PopoverAnchor } from "@radix-ui/react-popover";

const documents: TabItemProps[] = [
    {
        documentTitle: "Surat Pengajuan Bantuan Kemanusiaan untuk Korban Bencana Alam",
        cid: "bafkr....uapjm.pdf",
        fileType: "pdf",
        directoryName: "Surat Masuk",
        documentType: "Surat",
        createdAt: "12 Jun 2025, 10:23 WIB",
        viewsCount: 131,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
    {
        documentTitle: "Laporan Keuangan Bulanan",
        cid: "bafkr....uapjm.xlsx",
        fileType: "xls",
        directoryName: "Laporan Keuangan 2025",
        documentType: "Laporan",
        createdAt: "11 Jun 2025, 13:23 WIB",
        viewsCount: 11,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
    {
        documentTitle: "Rencana Kegiatan Tahunan 2025",
        cid: "bafkr....uapjm.docx",
        fileType: "doc",
        directoryName: "Perencanaan Kegiatan",
        documentType: "Lainnya",
        createdAt: "10 Jun 2025, 15:03 WIB",
        viewsCount: 8,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
    {
        documentTitle: "Kegiatan Penyembalihan Qurban 2025 di Desa Sukamaju",
        cid: "bafkr....qrtaf.jpg",
        fileType: "img",
        directoryName: "Dokumentasi Kegiatan",
        documentType: "Lainnya",
        createdAt: "10 Jun 2025, 15:03 WIB",
        viewsCount: 17,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
    {
        documentTitle:
            "Laporan Kegiatan Donasi Bencana Alam yang Dilakukan di Desa Sukamaju pada Tahun 2025.",
        cid: "bafkr....qrtaf.pdf",
        fileType: "pdf",
        directoryName: "Laporan Kegiatan Donasi Bencana Alam 2025",
        documentType: "Laporan",
        createdAt: "10 Jun 2025, 15:03 WIB",
        viewsCount: 17,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
    {
        documentTitle:
            "Laporan Kegiatan Donasi Bencana Alam yang Dilakukan di Desa Sukamaju pada Tahun 2025.",
        cid: "bafkr....qrtaf.pdf",
        fileType: "pdf",
        directoryName: "Laporan Kegiatan Donasi Bencana Alam 2025",
        documentType: "Laporan",
        createdAt: "10 Jun 2025, 15:03 WIB",
        viewsCount: 17,
        createdBy: {
            username: "alice",
            divisionName: "Divisi Fundraising",
        },
    },
]

export default function LastAddedTabContent() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearchOpen = () => {
        setIsSearchOpen(!isSearchOpen);
    }

    return (
        <>
            <div className="flex items-center gap-4 pb-1 justify-between">
                <p className="font-semibold ml-2">Terakhir ditambahkan ke arsip</p>
                <Select defaultValue="30days">
                    <SelectTrigger className="w-3xs shadow-none rounded-full border-none bg-gray-100 text-sm h-8 py-0 focus-within:ring-0">
                        <div className="flex items-center gap-2">
                            <ChartNoAxesGantt strokeWidth={2.5} />
                            <SelectValue placeholder="Select range" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="7days">7 Hari terakhir</SelectItem>
                            <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                            <SelectItem value="6months">6 Bulan terakhir</SelectItem>
                            <SelectItem value="1year">1 Tahun Terakhir</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="col-span-6 h-4 w-full sticky top-[150px] bg-white z-10 after:content-[''] after:absolute after:w-full after:h-8 after:bg-white" />
            <header
                className="grid grid-cols-[6fr_3.2fr_2fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-t-2xl border border-gray-200 text-sm sticky top-[164px] z-30 transition-all duration-300">
                <div className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-5 cursor-default sticky top-0 z-50">
                    <p className="font-medium text-neutral-500">Dokumen</p>
                    <p className="font-medium text-neutral-500">Direktori</p>
                    <p className="font-medium text-neutral-500">
                        Jenis Dokumen
                    </p>
                    <p className="font-medium text-neutral-500">
                        Ditambahkan pada
                    </p>
                    <p className="font-medium text-neutral-500">Dilihat</p>
                    <button onClick={handleSearchOpen} className="font-medium  flex items-center justify-center cursor-pointer hover:text-neutral-500">
                        {
                            isSearchOpen ? (
                                <TooltipText text="Tutup pencarian" bgColorTw="bg-gray-200 text-black">
                                    <Icon icon="material-symbols:close-rounded" width="20" />
                                </TooltipText>
                            ) : (
                                <TooltipText text="Cari dokumen" bgColorTw="bg-gray-200 text-black">
                                    <Search size={15} strokeWidth={2.5} />
                                </TooltipText>
                            )
                        }
                    </button>
                </div>
                <div className={`${!isSearchOpen && "hidden"} relative col-span-6 w-full px-4 mb-4`}>
                    <Search
                        size={16}
                        strokeWidth={2}
                        className="absolute left-8 top-1/2 -translate-y-1/2"
                    />
                    <Input
                        type="text"
                        className="pl-11 h-10 rounded-full bg-gray-100 border-none shadow-none focus-visible:ring-1"
                        placeholder="Masukan nama dokumen"
                    />
                </div>
            </header>
            <div className="grid grid-cols-[6fr_3.2fr_2fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-b-2xl border border-t-0 border-gray-200 text-sm overflow-hidden">
                {
                    documents.map((doc, index) => (
                        <TabItem
                            key={index}
                            documentTitle={doc.documentTitle}
                            cid={doc.cid}
                            fileType={doc.fileType}
                            directoryName={doc.directoryName}
                            documentType={doc.documentType}
                            createdAt={doc.createdAt}
                            viewsCount={doc.viewsCount}
                            createdBy={doc.createdBy}
                        />
                    ))
                }
                {
                    documents.map((doc, index) => (
                        <TabItem
                            key={index}
                            documentTitle={doc.documentTitle}
                            cid={doc.cid}
                            fileType={doc.fileType}
                            directoryName={doc.directoryName}
                            documentType={doc.documentType}
                            createdAt={doc.createdAt}
                            viewsCount={doc.viewsCount}
                            createdBy={doc.createdBy}
                        />
                    ))
                }
            </div>
        </>
    );
}

type UserType = {
    username: string;
    divisionName: string;
};

type TabItemProps = {
    documentTitle: string;
    cid: string;
    fileType: FileType;
    directoryName: string;
    documentType: string;
    createdAt: string;
    viewsCount: number;
    createdBy: UserType;
    updatedAt?: string;
    updatedBy?: UserType;
};

function TabItem(props: TabItemProps) {

    const handleDoubleClick = () => {
        alert(`Dokumen: ${props.documentTitle} telah diklik dua kali`);
    }

    return (
        <div className="col-span-6 grid items-center grid-cols-subgrid gap-2 px-6 py-4 border-t border-gray-200 cursor-default hover:bg-gray-50 transition duration-300 focus:bg-gray-200 select-none" tabIndex={0} onDoubleClick={handleDoubleClick}>
            {/* Dokumen */}
            <div className="flex items-center gap-2">
                <DocumentIcon type={props.fileType} />
                <div>
                    <TooltipText
                        delay={200}
                        text={props.documentTitle}
                        bgColorTw="bg-gray-200 text-black"
                    >
                        <p className="text-sm font-medium line-clamp-1 hover:text-neutral-600">
                            {props.documentTitle}
                        </p>
                    </TooltipText>
                    <p className="text-xs text-neutral-500">
                        {props.cid}
                    </p>
                </div>
            </div>
            {/* Direktori */}
            <div className="flex items-center gap-2">
                <Folder size={18} className="text-amber-600 min-w-fit" />
                <Link href={"/"} className="line-clamp-1 hover:underline">
                    {props.directoryName}
                </Link>
            </div>
            {/* Jenis Dokumen */}
            <p className="line-clamp-1">{props.documentType}</p>
            {/* Ditambahkan pada */}
            <p className="line-clamp-1 text-xs">{props.createdAt}</p>
            {/* Dilihat */}
            <div className="flex items-center gap-1">
                <Eye size={16} />
                <p>{props.viewsCount}</p>
            </div>
            {/* Elipsis */}
            <OthersInfo title={props.documentTitle}>
                {/* <TooltipText text="Lainnya" bgColorTw="bg-gray-200 text-black"> */}
                <div className="w-fit p-1 flex items-center justify-center rounded-full mx-auto hover:bg-gray-200 cursor-pointer transition">
                    <Ellipsis size={18} />
                </div>
                {/* </TooltipText> */}
            </OthersInfo>
        </div>
    );
}

function OthersInfo({ children, title }: { children?: React.ReactNode, title: string }) {
    return (
        <Popover modal={true}>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent side="left" className="max-w-lg w-fit grid grid-cols-[140px_1fr] gap-4 text-sm py-4 bg-gray-50">
                <p className="col-span-2 font-medium">{title}</p>
                <p className="text-neutral-500">No. Dokumen</p>
                <p>1129-9294</p>
                <p className="text-neutral-500">Ditambahkan Oleh</p>
                <p>Div. Kelembagaan <span className="text-neutral-500">(nur)</span></p>
                <p className="text-neutral-500">Berkas diubah pada</p>
                <p>24 Jun 2025, 10:31 WIB</p>
                <p className="text-neutral-500">Diubah oleh</p>
                <p>Div. Fundraising <span className="text-neutral-500">(budi)</span></p>
            </PopoverContent>
        </Popover>
    )
}