import fs from "fs/promises";
import path from "path";
import { possibleStacks } from "./arrays/project.arrays.js";
import { getNextRoutes } from "./analyzers/nextjs.analyzer.js";
import { getReactRoutes } from "./analyzers/react.analyzer.js";
import { folderFileSort } from "./helpers/project.helpers.js";
import type { Routes } from "./types/project.types.js";
import { getVueRoutes } from "./analyzers/vue.analyzer.js";

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
        }
    }
}

export async function getProjectInfo(projectPath: string) {
    const packagePath = `${projectPath}/package.json`;

    const {
        root: { folders, files },
        src
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
    } as const;

    if (framework === "Next.js") {
        routes = await getNextRoutes(path.join(projectPath, "src", "app"));
    } else if ("react-router-dom" in dependencies) {
        routes = await getReactRoutes(path.join(projectPath, "src"));
    } else if ("vue-router" in dependencies) {
        routes = await getVueRoutes(path.join(projectPath, "src"))
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