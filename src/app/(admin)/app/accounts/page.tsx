import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { SelectComponent } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import ListAccountsSection from "./_components/section-list-accounts";
import AddAccountDialog from "./_components/dialog-add-account";

export default function AccountsPage() {
    return (
        <>
            <section className="flex items-center px-4 py-6 gap-4 border-b-2 border-gray-200 border-dashed">
                <InputWithIcon
                    lucideIcon={Search}
                    placeholder="Masukan username"
                    className="rounded-full bg-gray-100 border-none w-xs"
                    type="search"
                />
                <SelectComponent
                    defaultValue="all-divisions"
                    items={[
                        { value: "all-divisions", label: "Semua Divisi" },
                        { value: "division1", label: "Divisi 1" },
                        { value: "division2", label: "Divisi 2" }
                    ]}
                    placeholder="Pilih divisi"
                />
                <SelectComponent
                    defaultValue="active"
                    items={[
                        { value: "all", label: "Semua Akun" },
                        { value: "active", label: "Akun Aktif" },
                        { value: "disabled", label: "Akun Tidak Aktif" }
                    ]}
                    placeholder="Pilih status akun"
                />
                <AddAccountDialog>
                    <Button className="ml-auto rounded-full ">
                        Tambah Akun
                        <Plus />
                    </Button>
                </AddAccountDialog>
            </section>
            <ListAccountsSection />
        </>
    )
}