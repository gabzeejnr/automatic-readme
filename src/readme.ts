import type { ReadmeData } from "./types/readme.types.js";

export function generateReadMe(data: ReadmeData) {
    let markdown = `# ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}

${data.description || ""}


## 🌐 Live Demo

${data.url}


## 🚀 Tech Stack\n\n`
    for (const tech of data.techStack) {
        markdown += `- ${tech}\n`
    }


    markdown += `\n\n## 📍 Routes\n\n`
    for (const route of data.routes) {
        markdown += `- \`${route}\`\n`;
    }


    markdown += `\n\n## 🔌 API Routes\n\n`
    for (const route of data.apiRoutes) {
        markdown += `- \`${route}\`\n`;
    };


    markdown += `\n\n## 🛠️ Scripts\n\n`;
    for (const [name, command] of Object.entries(data.scripts)) {
        markdown += `- \`${name}\`: \`${command}\`\n`;
    }

    return markdown
}