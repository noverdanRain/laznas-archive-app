"use client"

import { Button } from "@/components/ui/button";
import { InputWithIcon } from "@/components/ui/input";
import { SelectComponent } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import ListAccountsSection from "./_components/section-list-accounts";
import AddAccountDialog from "./_components/dialog-add-account";
import { useGetDivisions } from "@/hooks/useGetDivisions";
import SelectClearable from "@/components/common/select-clearable";

export default function AccountsPage() {
    const { data: divisions } = useGetDivisions();
    return (
        <>
            <section className="flex items-center px-4 py-6 gap-4 border-b-2 border-gray-200 border-dashed">
                <InputWithIcon
                    lucideIcon={Search}
                    placeholder="Masukan username"
                    className="rounded-full bg-gray-100 border-none w-xs"
                    type="search"
                />
                <SelectClearable
                    items={divisions?.map(division => ({
                        value: division.id,
                        label: division.name
                    })) || []}
                    placeholder="Pilih divisi"
                />
                <SelectClearable
                    items={[
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