import { atom } from "jotai";
import { IGetDirectoriesParams } from "./actions/query/directories";

type tabName = "last-added" | "last-modified" | "added-by-me";
export const activeTabAtom = atom<tabName>("last-added");

type TabName = "last-added" | "last-modified" | "directory";
export const activePublicTabAtom = atom<TabName>("last-added");

export const userSessionAtom = atom({
    username: "",
    role: "",
    divisionName:""
});

export const dirFilterAtom = atom<IGetDirectoriesParams>({});
