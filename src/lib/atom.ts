import { atom } from "jotai";

type tabName = "last-added" | "last-modified" | "added-by-me";
export const activeTabAtom = atom<tabName>("last-added");

type TabName = "last-added" | "last-modified" | "directory";
export const activePublicTabAtom = atom<TabName>("last-added");

export const userSessionAtom = atom({
    username: "",
    role: "",
    divisionName:""
});
