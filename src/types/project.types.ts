export type Routes = {
    routes: string[],
    apiRoutes: string[]
}

export type TechStack = {
    package: string,
    name: string,
    type: "framework" | "library" | "styling" | "backend" | "database";
}