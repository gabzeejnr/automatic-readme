import fs from "fs/promises";
import path from "path";
import { scrapeWebsite } from "./scraper.js";
import { getProjectInfo } from "./project.js";
import type { ReadmeData } from "./types/readme.types.js";
import { generateReadMe } from "./readme.js";

const dataFolder = "./data";
const url = process.argv[2];
const projectPath = process.argv[3];

if (!url || !projectPath) {
    console.log("Arguments not complete...")
    console.log("Usage: node src/index.js <website-url> <project-path>");
    process.exit(1);
}

const website = await scrapeWebsite(url);
const project = await getProjectInfo(projectPath);

const projectFolder = path.join(dataFolder, project.name);

await fs.mkdir(projectFolder, { recursive: true });

/* const payload = {
    name: project.name,
    version: project.version,
    framework: project.framework,
    techStack: project.techStack,
    scripts: project.scripts,
    folders: project.folders,
    files: project.files,
    routes: project.routes
} */

const { routes, apiRoutes } = project.routes

const readmeData: ReadmeData = {
    name: project.name,
    description: website.description,
    url: website.url,
    framework: project.framework,
    techStack: project.techStack,
    routes,
    apiRoutes,
    scripts: project.scripts
}

const readme = generateReadMe(readmeData);
console.log(readme);

await fs.writeFile(path.join(projectFolder, "readme-data.json"), JSON.stringify(readmeData, null, 4))
await fs.writeFile(path.join(projectFolder, "README.md"), readme, "utf-8");

console.log("Readme written...");

await fs.writeFile(path.join(projectFolder, "website.json"),
    JSON.stringify(website, null, 4)
)

console.log("Website data saved");
console.log("End....")