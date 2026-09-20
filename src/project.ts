import fs from "fs/promises";
import path from "path";
import { possibleStacks, ignoredFF } from "./arrays/project.arrays.js";
import { getNextRoutes } from "./analyzers/Nextjs.analyzer.js";
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

export type Routes = {
    routes: string[],
    apiRoutes: string[]
}

async function projectStructure(projectPath: string) {
    const docs = await fs.readdir(projectPath, { withFileTypes: true });

    const srcPath = path.join(projectPath, "src");
    const srcDocs = await fs.readdir(srcPath, { withFileTypes: true });

    // const appPath = path.join(projectPath, "src", "app");
    // const appDocs = await fs.readdir(appPath, { withFileTypes: true });

    // const productsPath = path.join(projectPath, "src", "app", "products");
    // const productsDocs = await fs.readdir(productsPath, { withFileTypes: true });

    const folders: string[] = [];
    const files: string[] = [];

    const srcFolders: string[] = [];
    const srcFiles: string[] = [];

    // const appFolders: string[] = [];
    // const appFiles: string[] = [];


    folderFileSort(docs, folders, files);
    folderFileSort(srcDocs, srcFolders, srcFiles);
    // folderFileSort(appDocs, appFolders, appFiles);

    return {
        root: {
            folders: folders,
            files: files
        },
        src: {
            folders: srcFolders,
            files: srcFiles
        },
        /* app: {
            folders: appFolders,
            files: appFiles
        } */
    }
}

export async function getProjectInfo(projectPath: string) {
    const packagePath = `${projectPath}/package.json`;

    const { root: { folders, files } } = await projectStructure(projectPath);

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
        routes = await getNextRoutes(path.join(projectPath, "src", "app"), "", framework);
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