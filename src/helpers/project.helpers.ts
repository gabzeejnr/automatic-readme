import fs from "fs/promises";
import path from "path";
import { ignoredFF, pageExtensions } from "../arrays/project.arrays.js";
import type { Dirent } from "fs";
import type { FolderFileSort } from "../types/helpers.types.js";

export function folderFileSort(array: Dirent[], folderArray: string[], fileArray: string[]): FolderFileSort {

    /* 
    *This function checks the file & folder array and sorts them into files and folders
    */

    array.forEach(arr => {
        if (ignoredFF.includes(arr.name)) return;

        if (arr.isDirectory()) {
            folderArray.push(arr.name);
        } else {
            fileArray.push(arr.name);
        }
    })

    return {
        folderArray,
        fileArray
    }
}

export async function scanNuxtPages(
    currentPath: string,
    routePath = ""
): Promise<string[]> {
    const routes: string[] = [];

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
        if (!entry.isDirectory() && path.extname(entry.name) === ".vue") {
            const fileName = path.basename(entry.name, ".vue");

            const route = fileName === "index"
                ? routePath || "/"
                : `${routePath}/${fileName}`;

            routes.push(route);
        } else if (
            entry.isDirectory()
            && !entry.name.startsWith(".")
            && !ignoredFF.includes(entry.name)
        ) {
            const childPath = path.join(currentPath, entry.name);

            const childRoutes = await scanNuxtPages(
                childPath,
                `${routePath}/${entry.name}`
            );

            routes.push(...childRoutes);
        }
    }
    return routes
}

export async function scanNuxtApi(
    currentPath: string,
    routePath = ""
): Promise<string[]> {
    const apiRoutes: string[] = [];

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isFile() && pageExtensions.includes(path.extname(entry.name))) {

            if (entry.name.split(".").length === 2) {
                apiRoutes.push(`GET /api/${routePath}`)
            } else {
                const split = entry.name.split(".")
                const typeIs = split[split.length - 2]
                apiRoutes.push(`${typeIs?.toUpperCase()} /api/${routePath}/${entry.name.split(".")[0]}`)
            }
        } else if (
            entry.isDirectory()
            && !entry.name.startsWith(".")
            && !ignoredFF.includes(entry.name)
        ) {
            const childPath = path.join(currentPath, entry.name);
            const childRoutes = await scanNuxtApi(childPath, entry.name);
            apiRoutes.push(...childRoutes);
        }
    }

    return apiRoutes
}