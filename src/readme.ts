import type { ReadmeData } from "./types/readme.types.js";

export function generateReadMe(data: ReadmeData) {
    let markdown = `# ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}


${data.description || ""}


## 🌐 Live Demo

${data.url}


## 🚀 Tech Stack

`

    for (const tech of data.techStack) {
        markdown += `- ${tech}\n`
    }

    markdown += `\n\n## 📍 Routes

`

    for(const route of data.routes){
        markdown += `- \`${route}\`\n`;
    }

    markdown += `\n\n## 🔌 API Routes

`

    for(const route of data.apiRoutes){
        markdown += `- \`${route}\`\n`;
    };

    markdown += `\n\n## 🛠️ Scripts
    
`;


    for (const [name, command] of Object.entries(data.scripts)){
        markdown += `- \`${name}\`: \`${command}\`\n`;
    }

    return markdown
}