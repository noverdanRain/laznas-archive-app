"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useAtom } from "jotai";
import { activePublicTabAtom } from "./tab-button";
import PublicHomeLastAdded from "./tab-content/last-added";
import PublicHomeLastModified from "./tab-content/last-modified";
import PublicHomeDirectories from "./tab-content/directory";
// import LastAddedTabContent from "./tab-contents/last-added";
// import LastModifiedTabContent from "./tab-contents/last-modified";
// import AddedByMeTabContent from "./tab-contents/addded-by-me";

export default function PublicHomeTabContainer() {

    const [activeTab] = useAtom(activePublicTabAtom);

    return (
        <section className="p-4">
            <Tabs
                defaultValue={"last-added" as typeof activeTab}
                value={activeTab}
                className="w-full"
            >
                <TabsContent value={"last-added" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <PublicHomeLastAdded />
                </TabsContent>
                <TabsContent value={"last-modified" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <PublicHomeLastModified/>
                </TabsContent>
                <TabsContent value={"directory" as typeof activeTab} className="min-h-[calc(100vh-178px)]">
                    <PublicHomeDirectories/>
                </TabsContent>
            </Tabs>
        </section>
    );
}
