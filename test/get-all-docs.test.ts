import { getAllDocuments } from "@/lib/actions/query/documents";

describe("Get All Documents", () => {
    test("Last Added 30 days ago", async () => {
        const result = await getAllDocuments({
            sort: {
                field: "title",
                order: "desc",
            },
        });
        console.log("Get All Documents :", result);
    });
});

describe("Test Pagination", () => {
    test("Pagination", async () => {
        const result = await getAllDocuments({
            sort: {
                field: "title",
                order: "desc",
            },
            page: 4,
            pageSize: 2,
        });
        console.log("Test Pagination:", result);
    });
});
