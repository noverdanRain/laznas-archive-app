export function throwActionError(error: unknown): never {
    throw new Error(
        `${
            error instanceof Error ? error.message : "Something went wrong!"
        }`
    );
}
