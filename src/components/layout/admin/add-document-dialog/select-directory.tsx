"use client"

import { Check, ChevronsUpDown, Folder } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { ScrollArea } from "../../../ui/scroll-area"
import { useQuery } from "@tanstack/react-query"
import { queryKey } from "@/constants"
import axios from "axios"
import { DirectoryTypes } from "@/types"

export function SelectDirectory({
    defaultValue,
    onValueChange,
    name
}: {
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
}) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    useEffect(()=>{
        if (defaultValue) {
            setValue(defaultValue)
            onValueChange?.(defaultValue)
        }
    }, [defaultValue])

    const getDirectories = useQuery({
        queryKey: [queryKey.GET_ALL_DIRECTORIES],
        queryFn: () => axios.get<DirectoryTypes[]>("/api/directories").then(res => res.data),
    })

    const handeValueChange = (dir: DirectoryTypes) => {
        setValue(dir.id === value ? "" : dir.id || "")
        onValueChange?.(dir.id === value ? "" : dir.id || "")
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full h-10 ${value ? "text-neutral-800" : "text-neutral-500"}`}
                >
                    <Folder className={`${value ? "text-amber-500 fill-amber-500" : ""}`} />
                    {value
                        ? getDirectories.data?.find((directory) => directory.id === value)?.name
                        : "Pilih Direktori"}
                    <ChevronsUpDown className="opacity-50 ml-auto" />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-full bg-amber-100 p-0">
                <input name={name} type="hidden" value={value} />
                <Command>
                    <CommandInput placeholder="Cari..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>
                            {
                                getDirectories.isLoading
                                    ? "Memuat direktori..."
                                    : "Direktori tidak ditemukan."
                            }
                        </CommandEmpty>
                        <div className="h-[200px] w-full overflow-y-auto">
                            <CommandGroup>
                                {getDirectories.data?.map((dir) => (
                                    <CommandItem
                                        key={dir.id}
                                        value={dir.name}
                                        onSelect={() => handeValueChange(dir)}
                                        className=" h-10"
                                    >
                                        <Folder className="text-amber-500 fill-amber-500" />
                                        {dir.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === dir.id ? "opacity-100" : "opacity-0"
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
    )
}
