import { Ellipsis, Eye, Folder, Search } from "lucide-react";
import { Icon } from "@iconify-icon/react";
import { TooltipText } from "@/components/common/tooltip-text";
import Link from "next/link";
import DocumentIcon, { type FileType } from "@/components/common/document-Icon";

export default function LastAddedTabContent() {
    return (
        <>
            <p className="font-semibold ml-2">Terakhir ditambahkan ke arsip</p>
            <div className="col-span-6 h-4 w-full sticky top-[150px] bg-white z-10 after:content-[''] after:absolute after:w-full after:h-8 after:bg-white" />
            <header
                className="grid grid-cols-[6fr_3fr_2.5fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-t-2xl border border-gray-200 text-sm sticky top-[164px] z-30">
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
                    <p className="font-medium text-neutral-500 flex items-center justify-center cursor-pointer hover:text-black">
                        <Search size={14} strokeWidth={2.5} />
                    </p>
                </div>
            </header>
            <div className="grid grid-cols-[6fr_3fr_2.5fr_3fr_1fr_1fr] gap-x-4 bg-white rounded-b-2xl border border-t-0 border-gray-200 text-sm overflow-hidden">
                <TabItem
                    documentTitle="Surat Pengajuan Bantuan Kemanusiaan untuk Korban Bencana Alam"
                    cid="bafkr....uapjm.pdf"
                    fileType="pdf"
                    directoryName="Surat Masuk"
                    documentType="Surat"
                    createdAt="12 Jun 2025, 10:23 WIB"
                    viewsCount={131}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Laporan Keuangan Bulanan"
                    cid="bafkr....uapjm.xlsx"
                    fileType="xls"
                    directoryName="Laporan Keuangan 2025"
                    documentType="Laporan"
                    createdAt="11 Jun 2025, 13:23 WIB"
                    viewsCount={11}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Rencana Kegiatan Tahunan 2025"
                    cid="bafkr....uapjm.docx"
                    fileType="doc"
                    directoryName="Perencanaan Kegiatan"
                    documentType="Lainnya"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={8}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Kegiatan Penyembalihan Qurban 2025 di Desa Sukamaju"
                    cid="bafkr....qrtaf.jpg"
                    fileType="img"
                    directoryName="Dokumentasi Kegiatan"
                    documentType="Lainnya"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={17}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Laporan Kegiatan Donasi Bencana Alam"
                    cid="bafkr....qrtaf.pdf"
                    fileType="pdf"
                    directoryName="Laporan Kegiatan"
                    documentType="Laporan"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={17}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Laporan Kegiatan Donasi Bencana Alam"
                    cid="bafkr....qrtaf.pdf"
                    fileType="pdf"
                    directoryName="Laporan Kegiatan"
                    documentType="Laporan"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={17}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Laporan Kegiatan Donasi Bencana Alam"
                    cid="bafkr....qrtaf.pdf"
                    fileType="other"
                    directoryName="Laporan Kegiatan"
                    documentType="Laporan"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={17}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
                <TabItem
                    documentTitle="Laporan Kegiatan Donasi Bencana Alam"
                    cid="bafkr....qrtaf.pdf"
                    fileType="pdf"
                    directoryName="Laporan Kegiatan"
                    documentType="Laporan"
                    createdAt="10 Jun 2025, 15:03 WIB"
                    viewsCount={17}
                    createdBy={{
                        username: "alice",
                        divisionName: "Divisi Fundraising",
                    }}
                />
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
                <Folder size={18} className="text-amber-600" />
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
            <TooltipText text="Lainnya" bgColorTw="bg-gray-200 text-black">
                <div className="w-fit p-1 flex items-center justify-center rounded-full mx-auto hover:bg-gray-200 cursor-pointer transition">
                    <Ellipsis size={18} />
                </div>
            </TooltipText>
        </div>
    );
}
