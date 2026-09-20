import type { TechStack } from "../types/project.types.js";

export const ignoredFF: string[] = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".gitignore",
    "README.md",
    "node_modules",
    ".git",
    ".next"
]

export const possibleStacks: TechStack[] = [
    // Frameworks & Libraries
    { package: "next", name: "Next.js", type: "framework" },
    { package: "react", name: "React", type: "library" },
    { package: "vue", name: "Vue.js", type: "framework" },
    { package: "nuxt", name: "Nuxt.js", type: "framework" },
    { package: "svelte", name: "Svelte", type: "framework" },
    { package: "@sveltejs/kit", name: "SvelteKit", type: "framework" },
    { package: "astro", name: "Astro", type: "framework" },
    { package: "@angular/core", name: "Angular", type: "framework" },
    { package: "solid-js", name: "SolidJS", type: "framework" },

    // Styling & Design Systems
    { package: "tailwindcss", name: "Tailwind CSS", type: "styling" },
    { package: "sass", name: "SCSS", type: "styling" },
    { package: "styled-components", name: "Styled Components", type: "styling" },
    { package: "framer-motion", name: "Framer Motion", type: "styling" },
    { package: "gsap", name: "GSAP (GreenSock)", type: "styling" },
    { package: "unocss", name: "UnoCSS", type: "styling" },

    // Backend, APIs & ORMs
    { package: "express", name: "Express", type: "backend" },
    { package: "@nestjs/core", name: "NestJS", type: "backend" },
    { package: "graphql", name: "GraphQL", type: "backend" },
    { package: "@trpc/server", name: "tRPC", type: "backend" },
    { package: "prisma", name: "Prisma", type: "backend" },
    { package: "drizzle-orm", name: "Drizzle ORM", type: "backend" },
    { package: "@supabase/supabase-js", name: "Supabase Client", type: "backend" },
    { package: "mongodb", name: "MongoDB Driver", type: "backend" },
    { package: "pg", name: "PostgreSQL Driver", type: "backend" },
    { package: "firebase", name: "Firebase Admin/SDK", type: "backend" }
];

export const pageExtensions: string[] = [".tsx", ".jsx", ".ts", ".js"];

export const routeLocations: string[] = ["route", "routes", "router"];