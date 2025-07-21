"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, Lock } from "lucide-react";
import { useEffect, useState } from "react";

type Visibility = "private" | "public";

export default function VisibilityRadioGroup({ selected }: { selected?: (value: Visibility) => void }) {
    const [visibility, setVisibility] = useState<Visibility>("private");
    useEffect(() => {
        selected?.(visibility);
    }, [visibility]);

    return (
        <RadioGroup defaultValue={visibility} onValueChange={(value) => setVisibility(value as Visibility)} className="flex w-full">
            <div className="flex items-center space-x-2 w-full">
                <RadioGroupItem value={"private"} id="option-private" hidden />
                <Label
                    htmlFor="option-private"
                    className={
                        `space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full ${visibility === "private" ?
                            "bg-emerald-50 border-emerald-500" :
                            ""}`
                    }
                >
                    <Lock size={20} className={`${visibility === "private" ? "text-emerald-600" : ""}`} />
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">Private</p>
                        <p className="text-sm text-gray-500">
                            Hanya dapat diakses oleh akun staff 
                        </p>
                    </div>
                </Label>
            </div>
            <div className="flex items-center space-x-2 w-full">
                <RadioGroupItem value={"public"} id="option-public" hidden />
                <Label
                    htmlFor="option-public"
                    className={
                        `space-x-1 p-4 rounded-xl border-2 border-gray-200 w-full ${visibility === "public" ?
                            "bg-emerald-50 border-emerald-500" :
                            ""}`
                    }
                >
                    <Eye size={20} className={`${visibility === "public" ? "text-emerald-600" : ""}`} />
                    <div className="flex flex-col">
                        <p className="text-sm font-medium">Public</p>
                        <p className="text-sm text-gray-500">
                            Dapat diakses oleh semua orang di internet
                        </p>
                    </div>
                </Label>
            </div>
        </RadioGroup>
    );
}