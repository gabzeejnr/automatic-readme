import fs from "fs/promises";
import path from "node:path";
import { folderFileSort } from "../project.js";
import { pageExtensions, ignoredFF, routeLocations } from "../arrays/project.arrays.js";
import type { Routes } from "../project.js";

export async function getReactRoutes(
    srcPath: string,
    framework?: string
) {

    const docs = await fs.readdir(srcPath, { withFileTypes: true });

    const folders: string[] = [];
    const files: string[] = [];

    folderFileSort(docs, folders, files);

    const routeFolder = folders.find(folder => routeLocations.includes(folder));

    const content = await fs.readdir(path.join(srcPath, routeFolder!));

    console.log(content)



    return {
        routes: [""],
        apiRoutes: [""]
    }
}