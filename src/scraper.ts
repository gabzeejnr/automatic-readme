import * as cheerio from "cheerio";
import type { Website } from "./types/website.types.js";

export async function scrapeWebsite(url: string) {

    console.log('Starting...');

    let parsedUrl: string;

    if (url.startsWith("http://") || url.startsWith("https://")) parsedUrl = url;
    else parsedUrl = "https://" + url;

    console.log(parsedUrl);

    const res = await fetch(parsedUrl);

    const html = await res.text();

    const $ = cheerio.load(html);

    const website: Website = {

        url: parsedUrl,

        title: $("title").text().trim(),

        description:
            $('meta[name="description"]').attr("content")?.trim() || "",

        headings: $("h1, h2, h3")
            .map((_, element) => $(element).text().trim())
            .get()
            .filter(Boolean),

        links: $("a")
            .map((_, element) => $(element).attr("href"))
            .get()
            .filter(Boolean)
            .filter((
                link: string,
                index: number,
                array: string[]
            ) => array.indexOf(link) === index),

        images: $("img")
            .filter((_, element) => Boolean($(element).attr("src")))
            .map((_, element) => ({
                src: $(element).attr("src")!,
                alt: $(element).attr("alt") || ""
            }))
            .get()
    };

    return website;
}