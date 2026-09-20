import * as cheerio from "cheerio";
import type { Website } from "./types/website.types.js";
import { chromium } from "playwright"

export async function scrapeWebsite(url: string) {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('Starting...');

    let parsedUrl: string;

    if (url.startsWith("http://") || url.startsWith("https://")) parsedUrl = url;
    else parsedUrl = "https://" + url;

    await page.goto(parsedUrl);

    const html = await page.content()

    const $ = cheerio.load(html);

    await browser.close();

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