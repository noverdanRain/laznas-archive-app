"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { activeTabAtom } from "./tab-button";
import LastAddedTabContent from "./tab-contents/last-added";
import LastModifiedTabContent from "./tab-contents/last-modified";
import AddedByMeTabContent from "./tab-contents/addded-by-me";

export default function HomepageTabContainer() {
    
    const [activeTab] = useAtom(activeTabAtom);

    return (
        <section className="p-4">
            <Tabs
                defaultValue={"last-added" as typeof activeTab}
                value={activeTab}
                className="w-full"
            >
                <TabsContent value={"last-added" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <LastAddedTabContent/>
                </TabsContent>
                <TabsContent value={"last-modified" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <LastModifiedTabContent/>
                </TabsContent>
                <TabsContent value={"added-by-me" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <AddedByMeTabContent/>
                </TabsContent>
            </Tabs>
        </section>
    );
}
