export namespace FileManager {
    export type DeleteProfilePhoto = {
        success: boolean;
        file: string;
        message: string[];
    };
    export type ReadDir = {
        success: boolean;
        /** `[<file name>, <file path>, <"file" | "dir">, <file size in byte>, <fileModel>{}?][] | undefined`; */
        dir?: [string, string, string, number, {}?][];
        message: string[];
    };
    export type CreateDir = {
        success: boolean;
        dir?: string;
        message: string[];
    };
    export type ReturnDir = {
        success: boolean;
        file?: any | any[];
        dir?: string;
        message: string[];
    };
    export type RenameOne = { [key in keyof ReturnDir]: ReturnDir[key] };
    export type DeleteOne = { [key in keyof ReturnDir]: ReturnDir[key] };
    export type CopyOne = { [key in keyof ReturnDir]: ReturnDir[key] };
};