import fs from "fs/promises";
import path from "node:path";
import { pageExtensions, ignoredFF } from "../arrays/project.arrays.js";
import type { Routes } from "../project.js";

export async function getNextRoutes(
    currentPath: string,
    routePath = "",
    framework?: string
): Promise<Routes> {

    const routes: string[] = [];
    const apiRoutes: string[] = []

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {

        const isPage = entry.name.startsWith("page.") && pageExtensions.includes(path.extname(entry.name));
        const isApi = entry.name.startsWith("route.") && pageExtensions.includes(path.extname(entry.name));

        if (!entry.isDirectory() && isPage) {
            const route = routePath || "/";
            routes.push(route);
        } else if (!entry.isDirectory() && isApi) {
            apiRoutes.push(routePath);
        } else if (entry.isDirectory() && !entry.name.startsWith(".") && !ignoredFF.includes(entry.name)) {
            const childPath = path.join(currentPath, entry.name);

            const childRoutes = await getNextRoutes(childPath, `${routePath}/${entry.name}`);
            routes.push(...childRoutes.routes);
            apiRoutes.push(...childRoutes.apiRoutes);
        }

    }

    routes.sort((a, b) => a.localeCompare(b))
    apiRoutes.sort((a, b) => a.localeCompare(b));

    return {
        routes,
        apiRoutes
    }
}