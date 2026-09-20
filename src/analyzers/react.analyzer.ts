import fs from "fs/promises";
import path from "node:path";
import { folderFileSort } from "../project.js";
import { pageExtensions, ignoredFF, routeLocations } from "../arrays/project.arrays.js";
import type { Routes } from "../project.js";

export async function getReactRoutes(
    srcPath: string
): Promise<Routes> {

    const docs = await fs.readdir(srcPath, { withFileTypes: true });

    const folders: string[] = [];
    const files: string[] = [];

    folderFileSort(docs, folders, files);

    const routeFolder = folders.find(folder => routeLocations.includes(folder));
    if (!routeFolder) throw new Error("No route folder found");

    const folderPath = path.join(srcPath, routeFolder);

    const content = await fs.readdir(folderPath, { withFileTypes: true });

    const routes: string[] = [];

    for (const con of content) {
        if (
            con.isFile()
            && !ignoredFF.includes(con.name)
            && pageExtensions.includes(path.extname(con.name))
        ) {
            const routeContent = await fs.readFile(path.join(folderPath, con.name), "utf-8");

            const routesTags = [...routeContent.matchAll(/path=["']([^"']+)["']/g)].map(match => match[1])
            if (!routesTags.length) throw new Error("Routes not found...");

            for (const route of routesTags) {
                if (!route) throw new Error("Route not defined");

                const thisRoute = route.startsWith("/") ? route : `/${route}`;

                routes.push(thisRoute);
            }
        }
    }

    return {
        routes,
        apiRoutes: [""]
    }
}