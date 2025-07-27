export interface CustomMutateHooksProps {
    onSuccess?: () => void;
    onReject?: (message: string) => void;
    onError?: (error: Error) => void;
}

export interface MutateActionsReturnType {
    isSuccess: boolean;
    isRejected: boolean;
    reject?: {
        message?: string;
    };
}


export interface DivisionTypes {
    id: string;
    name: string;
}
export interface TypeOfDocumentTypes {
    id: string;
    name: string;
}

export interface DirectoryTypes {
    id?: string;
    name: string;
    description: string;
    isPrivate?: boolean;
}

export interface StaffTypes {
    username: string;
    division: DivisionTypes;
    role: "administrator" | "staff";
    isDisabled: boolean;
}

export interface AddStaffParams {
    username: string;
    password: string;
    divisionId: string;
}
