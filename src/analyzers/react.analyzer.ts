import fs from "fs/promises";
import path from "node:path";
import { folderFileSort } from "../helpers/project.helpers.js";
import { pageExtensions, ignoredFF, routeLocations } from "../arrays/project.arrays.js";
import type { Routes } from "../types/project.types.js";

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
    let parentRoute: string = "";

    for (const con of content) {
        if (
            con.isFile()
            && !ignoredFF.includes(con.name)
            && pageExtensions.includes(path.extname(con.name))
        ) {
            const routeContent = await fs.readFile(path.join(folderPath, con.name), "utf-8");

            const routeLines = routeContent.split("\n")
                .filter(line =>
                    line.includes("<Route")
                    && !line.includes("<Routes")
                );

            for (const line of routeLines) {

                const isParent = !line.trim().endsWith("/>");
                const pathMatch = line.match(/path=["']([^"']+)["']/);
                const route = pathMatch?.[1];

                if (!route) continue;

                if (isParent) {
                    parentRoute = route;
                    routes.push(route)
                } else if (parentRoute) {
                    const thisRoute = `${parentRoute}/${route}`.replace(/\/+/g, "/");
                    routes.push(thisRoute);
                } else {
                    routes.push(route.startsWith("/") ? route : `/${route}`)
                }
            }
        }
    }

    return {
        routes,
        apiRoutes: [""]
    }
}