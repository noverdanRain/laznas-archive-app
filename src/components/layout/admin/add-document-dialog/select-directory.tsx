"use client"

import { Check, ChevronsUpDown, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { useGetDirectories } from "@/hooks/useGetDirectories"

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

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue)
            onValueChange?.(defaultValue)
        }
    }, [defaultValue])

    const { directories, isLoading } = useGetDirectories();

    const handleValueChange = (id: string) => {
        setValue(id === value ? "" : id || "")
        onValueChange?.(id === value ? "" : id || "")
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
                        ? directories?.find((directory) => directory.id === value)?.name
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
                                isLoading
                                    ? "Memuat direktori..."
                                    : "Direktori tidak ditemukan."
                            }
                        </CommandEmpty>
                        <div className="h-[200px] w-full overflow-y-auto">
                            <CommandGroup>
                                {directories?.map((dir) => (
                                    <CommandItem
                                        key={dir.id}
                                        value={dir.name}
                                        onSelect={() => handleValueChange(dir.id)}
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
