import fs from "fs/promises";
import path from "node:path";
import { pageExtensions, ignoredFF } from "../arrays/project.arrays.js";
import type { Routes } from "../types/project.types.js";
import { scanNuxtApi, scanNuxtPages } from "../helpers/project.helpers.js";

export async function getPageRoutes(
    currentPath: string,
    routePath = "",
    framework: string
): Promise<Routes> {

    const routes: string[] = [];
    const apiRoutes: string[] = []

    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    if (framework.toLowerCase() === "next.js") {
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

                const childRoutes = await getPageRoutes(childPath, `${routePath}/${entry.name}`, framework);
                routes.push(...childRoutes.routes);
                apiRoutes.push(...childRoutes.apiRoutes);
            }

        }
    } else if (framework.toLowerCase() === "nuxt.js") {
        for (const entry of entries) {
            if (entry.name === "pages") {
                const pagePath = path.join(currentPath, "pages");
                const pageRoutes = await scanNuxtPages(pagePath);
                routes.push(...pageRoutes);
            } else if (entry.name === "server") {
                const apiPath = path.join(currentPath, "server", "api");
                const apiRoute = await scanNuxtApi(apiPath);
                apiRoutes.push(...apiRoute)
            }
        }
    }

    routes.sort((a, b) => a.localeCompare(b))
    apiRoutes.sort((a, b) => a.localeCompare(b));

    return {
        routes,
        apiRoutes
    }
}