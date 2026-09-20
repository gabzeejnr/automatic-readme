export type ReadmeData = {
    name: string,
    description?: string | undefined,
    authors?: {
        name: string,
        github: string
    }[],
    url?: string,
    framework: string,
    techStack: string[],
    routes: string[],
    apiRoutes: string[],
    apiReference?: {
        parameter: string,
        type: string,
        description: string,
        required?: true
    }[],
    scripts: {}[]
}