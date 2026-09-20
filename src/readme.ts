import type { ReadmeData } from "./types/readme.types.js";

const apiCalls: readonly string[] = ["DELETE", "PUT", "POST", "GET"]

export function generateReadMe(data: ReadmeData) {
    let markdown = `# ${data.name.charAt(0).toUpperCase() + data.name.slice(1)}

${data.description || ""}


## 🌐 Live Demo

${data.url}


## 🚀 Tech Stack\n\n`
    for (const tech of data.techStack) {
        markdown += `- ${tech}\n`
    }

    if (data.authors?.length) {
        markdown += `## Authors`
        for (const author of data.authors) {
            markdown += `\n- [${author.name}](${author.github})`
        }
    }


    markdown += `\n\n## 📍 Routes\n\n`
    for (const route of data.routes) {
        markdown += `- \`${route}\`\n`;
    }

    if (data.apiRoutes.length > 0) {
        markdown += `\n\n## 🔌 API Routes\n\n`
        for (const route of data.apiRoutes) {
            if (apiCalls.includes(route.split(" ")[0]!)) {

                markdown += `\n\`\`\`http
  ${route}
\`\`\`
`
            } else {
                markdown += `- \`${route}\`\n`;
            }
        };

        if (data.apiReference?.length) {
            markdown += `\n\n| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |`

            for (const ref of data.apiReference) {
                markdown += `\n| \`${ref.parameter}\`      | \`${ref.type}\` | ${ref.required ? `**Required**. ${ref.description}` : ref.description} |`
            }
        }
    }


    markdown += `\n\n## 🛠️ Scripts\n\n`;
    for (const [name, command] of Object.entries(data.scripts)) {
        markdown += `- \`${name}\`: \`${command}\`\n`;
    }

    return markdown
}