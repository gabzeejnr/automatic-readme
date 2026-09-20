export type Website = {
    url: string,
    title: string,
    description?: string,
    headings: string[],
    links: string[],
    images: {
        src: string,
        alt: string
    }[]
}