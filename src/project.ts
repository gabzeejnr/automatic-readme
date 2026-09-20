import fs from "fs/promises";
import path from "path";
import {
    possibleStacks, ignoredFF, pageExtensions,
} from "./arrays/project.arrays.js";
import type { Dirent } from "fs";

function folderFileSort(array: Dirent[], folderArray: string[], fileArray: string[]) {

    array.forEach(arr => {
        if (ignoredFF.includes(arr.name)) return;

        if (arr.isDirectory()) {
            folderArray.push(arr.name);
        } else {
            fileArray.push(arr.name);
        }
    })

    return { folderArray, fileArray }
}

type Routes = {
    routes: string[],
    apiRoutes: string[]
}

async function getPageRoutes(
    currentPath: string,
    routePath = ""
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

            const childRoutes = await getPageRoutes(childPath, `${routePath}/${entry.name}`);
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

async function projectStructure(projectPath: string) {
    const docs = await fs.readdir(projectPath, { withFileTypes: true });

    const srcPath = path.join(projectPath, "src");
    const srcDocs = await fs.readdir(srcPath, { withFileTypes: true });

    const appPath = path.join(projectPath, "src", "app");
    const appDocs = await fs.readdir(appPath, { withFileTypes: true });

    const productsPath = path.join(projectPath, "src", "app", "products");
    const productsDocs = await fs.readdir(productsPath, { withFileTypes: true });

    const folders: string[] = [];
    const files: string[] = [];

    const srcFolders: string[] = [];
    const srcFiles: string[] = [];

    const appFolders: string[] = [];
    const appFiles: string[] = [];


    folderFileSort(docs, folders, files);
    folderFileSort(srcDocs, srcFolders, srcFiles);
    folderFileSort(appDocs, appFolders, appFiles);

    return {
        root: {
            folders: folders,
            files: files
        },
        src: {
            folders: srcFolders,
            files: srcFiles
        },
        app: {
            folders: appFolders,
            files: appFiles
        }
    }
}

export async function getProjectInfo(projectPath: string) {
    const packagePath = `${projectPath}/package.json`;

    const {
        root: { folders, files },
        src, app
    } = await projectStructure(projectPath);

    const packageFile = await fs.readFile(packagePath, "utf-8");

    const packageJson = JSON.parse(packageFile);

    const dependencies = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
    };

    const techStack: string[] = [];

    let framework: string = "Unknown";

    for (const stack of possibleStacks) {
        if (stack.package in dependencies) {
            techStack.push(stack.name);

            if (stack.type === "framework") framework = stack.name
        }
    }

    let routes: Routes = {
        routes: [""],
        apiRoutes: [""]
    };

    if (framework === "Next.js") {
        routes = await getPageRoutes(path.join(projectPath, "src", "app"));
    }

    return {
        folders,
        files,
        name: packageJson.name,
        version: packageJson.version,
        routes: routes,
        framework,
        techStack,
        scripts: packageJson.scripts,
        dependencies,
        devDependencies: packageJson.devDependencies
    }
}