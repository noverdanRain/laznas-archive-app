import { getAllDocuments } from "@/lib/actions/query/documents";
import moment from "moment-timezone";

// describe("Get All Documents", () => {
//     test("Last Added 30 days ago", async () => {
//         const result = await getAllDocuments({
//             sort: {
//                 field: "title",
//                 order: "desc",
//             },
//         });
//         console.log("Get All Documents :", result);
//     });
// });

// describe("Test Pagination", () => {
//     test("Pagination", async () => {
//         const result = await getAllDocuments({
//             sort: {
//                 field: "title",
//                 order: "desc",
//             },
//             paginate: {
//                 page: 1,
//                 pageSize: 10,
//             }
//         });
//         console.log("Test Pagination:", result);
//     });
// });

test("Moment Timezone", () => {
    const date = new Date("2025-08-12T10:23:00Z");
    const formattedDate = moment(date)
        .locale("id")
        .tz("Asia/Jakarta")
        .format("DD MMM YYYY, HH:mm");
    console.log("Formatted Date:", formattedDate);
    // expect(formattedDate).toBe("12 Jun 2025, 17:23");
});
