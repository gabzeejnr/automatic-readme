import fs from "fs/promises";
import path from "path";
import PromptSync from "prompt-sync";
import { scrapeWebsite } from "./scraper.js";
import { getProjectInfo } from "./project.js";
import type { ReadmeData } from "./types/readme.types.js";
import { generateReadMe } from "./readme.js";

const prompt = PromptSync({ sigint: true })
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

let projectName = project.name;

if (!projectName) {
    projectName = prompt('Enter project name: ')
}

const projectFolder = path.join(dataFolder, projectName);

await fs.mkdir(projectFolder, { recursive: true });

const { routes, apiRoutes } = project.routes

const readmeData: ReadmeData = {
    name: projectName,
    description: website.description,
    url: website.url,
    authors: [
        {
            name: "Gabriel Dodowei",
            github: "https://github.com/gabzeejnr"
        }
    ],
    framework: project.framework,
    techStack: project.techStack,
    routes,
    apiRoutes,
    apiReference: [
        {
            parameter: "id",
            type: "string",
            description: "Id of item to fetch",
            required: true
        }
    ],
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