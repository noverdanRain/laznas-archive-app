import { UseGetDocumentsParams } from "@/hooks/useGetDocuments";

export const queryKey = {
    GET_ALL_STAFF: "get-all-staff",
    ADD_NEW_STAFF: "post-staff",
    GET_ALL_DIVISION: "get-all-divisions",
    GET_ALL_DOCUMENT_TYPES: "get-all-document-types",
    GET_ALL_DOCUMENTS: "get-all-documents",
    GET_ALL_DIRECTORIES: "get-all-directories",
}
export const documentsPage_useGetDocumentsKey = ["documents-page"];
export const lastAddedTabHome_queryKey = ["last-added-documents"];
export const publicDocumentsPage_useGetDocumentsParams: UseGetDocumentsParams = {
    key: ["public-documents"],
    filter: {
        visibility: "public",
        lastAdded: "30days"
    },
    sort: {
        field: "createdAt",
        order: "desc"
    }
};

export const gatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || "https://gateway.pinata.cloud/ipfs";