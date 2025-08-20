import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { editDocumentFormSchema } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, EyeOff, Folder } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useUserSession } from "@/hooks/useUserSession";
import { getDirectories } from "@/lib/actions";

type directoriesType = Awaited<ReturnType<typeof getDirectories>>;
type directoryType = directoriesType[number];

export default function SelectDirectoryField({ form, onDirChanged }: {
    form: ReturnType<typeof useForm<z.infer<typeof editDocumentFormSchema>>>,
    onDirChanged?: (dir: directoryType) => void
}) {
    const { userSession } = useUserSession();
    const { directories, isLoading, } = useGetDirectories({
        key: ["select-directory", `dir-${userSession?.divisionId}`],
        filter: {
            divisionId: userSession?.divisionId || "0"
        }
    });

    const [popoverOpen, setPopoverOpen] = useState(false);

    const getDirById = (id: string) => {
        const dir = directories?.find((directory) => directory.id === id);
        return dir;
    }


    return (
        <FormField
            control={form.control}
            name="directoryId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Direktori</FormLabel>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                {/* <div> */}
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={`w-full h-10 ${field.value ? "text-neutral-800" : "text-neutral-500"}`}
                                >
                                    <Folder className={`${field.value ? "text-amber-500 fill-amber-500" : ""}`} />
                                    {
                                        field.value
                                            ? (
                                                <>
                                                    <span>{getDirById(field.value)?.name}</span>
                                                    {getDirById(field.value)?.isPrivate && <EyeOff className="text-neutral-800 size-2.5" strokeWidth={2.3} />}
                                                </>
                                            )
                                            : "Pilih direktori"
                                    }
                                    <ChevronsUpDown className="opacity-50 ml-auto" />
                                </Button>
                                {/* <Input {...field} type="hidden" /> */}
                                {/* </div> */}
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-full bg-amber-100 p-0">
                            <Command>
                                <CommandInput placeholder="Cari..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>
                                        {
                                            isLoading
                                                ? "Memuat direktori..."
                                                : "Direktori tidak ditemukan."
                                        }
                                    </CommandEmpty>
                                    <div className="w-full overflow-y-auto">
                                        <CommandGroup>
                                            {directories?.map((dir) => (
                                                <CommandItem
                                                    key={dir.id}
                                                    value={dir.name}
                                                    onSelect={() => {
                                                        field.onChange(dir.id);
                                                        setPopoverOpen(false);
                                                        onDirChanged?.(dir);
                                                    }}
                                                    className=" h-10"
                                                >
                                                    <Folder className="text-amber-500 fill-amber-500" />
                                                    {dir.name}
                                                    {
                                                        dir.isPrivate && (
                                                            <EyeOff className="text-neutral-800 size-2.5" strokeWidth={2.3} />
                                                        )
                                                    }
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            field.value === dir.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </div>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}