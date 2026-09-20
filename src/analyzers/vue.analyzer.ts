import fs from "fs/promises";
import path from "path";
import { pageExtensions, ignoredFF, routeLocations } from "../arrays/project.arrays.js";
import type { Routes } from "../types/project.types.js";
import { folderFileSort } from "../helpers/project.helpers.js";

export async function getVueRoutes(srcPath: string): Promise<Routes> {

    const routes: string[] = [];
    const apiRoutes: string[] = [];

    const docs = await fs.readdir(srcPath, { withFileTypes: true });

    const folders: string[] = [];
    const files: string[] = [];
    folderFileSort(docs, folders, files);

    const routeFolder = folders.find(folder => routeLocations.includes(folder));
    if (!routeFolder) throw new Error("No route folder found");

    const folderPath = path.join(srcPath, routeFolder);
    const content = await fs.readdir(folderPath, { withFileTypes: true });

    for (const con of content) {
        if (
            con.isFile()
            && !ignoredFF.includes(con.name)
            && pageExtensions.includes(path.extname(con.name))
        ) {
            const routeContent = await fs.readFile(path.join(folderPath, con.name), "utf-8")

            const routeMatch = [...routeContent.matchAll(/path:\s*['"]([^'"]+)['"]/g)];
            const route = routeMatch.map(match => match[1]);
            if (!route.length) throw new Error("No route defined...");

            for (const r of route) {
                if (!r) throw new Error(`Route [${r}] is not defined...`);

                routes.push(r)
            }
        }
    }
    console.log(routes);

    return {
        routes,
        apiRoutes
    }
}