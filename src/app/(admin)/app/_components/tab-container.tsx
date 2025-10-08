"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { activeTabAtom } from "@/lib/atom";
import LastAddedTabContent from "./tab-contents/last-added";
import LastModifiedTabContent from "./tab-contents/last-modified";
import AddedByMeTabContent from "./tab-contents/addded-by-me";
import { useSearchParams } from "next/navigation";

export default function HomepageTabContainer() {
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("t") || "last-added";
    

    return (
        <section className="p-4">
            <Tabs
                defaultValue={"last-added"}
                value={activeTab}
                className="w-full"
            >
                <TabsContent value={"last-added"} className="min-h-[calc(100vh-178px)]">
                    <LastAddedTabContent/>
                </TabsContent>
                <TabsContent value={"last-modified"} className="min-h-[calc(100vh-178px)]">
                    <LastModifiedTabContent/>
                </TabsContent>
                <TabsContent value={"added-by-me"} className="min-h-[calc(100vh-178px)]">
                    <AddedByMeTabContent/>
                </TabsContent>
            </Tabs>
        </section>
    );
}
