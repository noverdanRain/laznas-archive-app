import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDocumentFormSchema } from "..";
import { useForm } from "react-hook-form";
import z from "zod";
import { useState } from "react";
import { useGetDirectories } from "@/hooks/useGetDirectories";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Folder } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function SelectDirectoryField({ form }: { form: ReturnType<typeof useForm<z.infer<typeof addDocumentFormSchema>>> }) {
    const { directories, isLoading } = useGetDirectories();

    const [popoverOpen, setPopoverOpen] = useState(false);


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
                                        {field.value
                                            ? directories?.find((directory) => directory.id === field.value)?.name
                                            : "Pilih direktori"}
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
                                                    }}
                                                    className=" h-10"
                                                >
                                                    <Folder className="text-amber-500 fill-amber-500" />
                                                    {dir.name}
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