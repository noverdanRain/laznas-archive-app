"use client";

import { TooltipText } from "@/components/common/tooltip-text";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Ban, Check, Loader2, Pencil } from "lucide-react";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { useGetStaff } from "@/hooks/useGetStaff";
import { useEditStaffStatus } from "@/hooks/useEditStaffStatus";
import EditAccountDialog from "./dialog-edit-account";

type GetStaffReturn = ReturnType<typeof useGetStaff>;

export default function ListAccountsSection({ getStaff }: { getStaff: GetStaffReturn }) {
    const { staffs, isLoading } = getStaff;

    if (isLoading) {
        return (
            <section>
                <Loader2 className="w-8 h-8 mx-auto mt-10 text-emerald-500 animate-spin" />
            </section>
        );
    }

    return (
        <section className="grid grid-cols-2 gap-3 p-4">
            {staffs?.map((staff) => (
                <Item
                    key={staff.username}
                    username={staff.username}
                    division={staff.division}
                    isDisabled={staff.isDisabled}
                    id={staff.id}
                />
            ))}
        </section>
    );
}

function Item({
    id,
    username,
    division,
    isDisabled,
}: {
    id: string;
    username: string;
    division: { id: string; name: string };
    isDisabled: boolean;
}) {

    const disableStaff = useEditStaffStatus({ setStatus: "disable" });
    const enableStaff = useEditStaffStatus({ setStatus: "enable" });

    const handleDisableAccount = () => {
        disableStaff.mutate(id);
    };

    const handleEnableAccount = () => {
        enableStaff.mutate(id);
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200">
            <div className="flex items-center gap-2">
                <Avatar className="size-11">
                    <AvatarFallback className="bg-gray-200 font-semibold">
                        {username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">@{username}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Div. {division.name}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                {isDisabled ? (
                    <Badge className="bg-red-100 border border-red-400 text-primary rounded-full">
                        Disabled
                    </Badge>
                ) : (
                    <Badge className="bg-green-100 border border-green-400 text-primary rounded-full">
                        Actived
                    </Badge>
                )}
                <div className="flex items-center gap-2">
                    <TooltipText
                        text="Edit akun"
                        bgColorTw="bg-gray-200 text-neutral-800"
                    >
                        <EditAccountDialog
                            defaultValues={{
                                username: username,
                                divisionId: division.id,
                            }}
                            id={id}
                        >
                            <button className="text-neutral-600 hover:text-neutral-800 cursor-pointer">
                                <Pencil size={18} />
                            </button>
                        </EditAccountDialog>
                    </TooltipText>
                    {isDisabled ? (
                        <TooltipText
                            text="Aktifkan akun"
                            bgColorTw="bg-gray-200 text-neutral-800"
                        >
                            <button
                                onClick={handleEnableAccount}
                                className="text-green-500 hover:text-green-700 cursor-pointer"
                            >
                                <Check size={18} />
                            </button>
                        </TooltipText>
                    ) : (
                        <TooltipText
                            text="Nonaktifkan akun"
                            bgColorTw="bg-gray-200 text-neutral-800"
                        >
                            <AlertDialogComponent
                                title="Nonaktifkan Akun"
                                description={`Apakah Anda yakin ingin menonaktifkan akun @${username}?`}
                                onConfirm={handleDisableAccount}
                            >
                                <button className="text-red-500 hover:text-red-700 cursor-pointer">
                                    <Ban size={18} />
                                </button>
                            </AlertDialogComponent>
                        </TooltipText>
                    )}
                </div>
            </div>
        </div>
    );
}
